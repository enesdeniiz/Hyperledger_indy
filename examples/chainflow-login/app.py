#!/usr/bin/env python3
import os
import json
import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import datetime, timedelta

# Dotenv import - comment out if not available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("dotenv not installed, using default environment variables")

# Initialize FastAPI app
app = FastAPI(title="ChainFlow SSI Login System")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

# Mock Agent class for demo purposes
class MockAgent:
    def __init__(self, endpoint, wallet_name, wallet_key, pool_name, genesis_file):
        self.endpoint = endpoint
        self.wallet_name = wallet_name
        self.wallet_key = wallet_key
        self.pool_name = pool_name
        self.genesis_file = genesis_file
        print(f"Mock Agent initialized with endpoint: {endpoint}")
        
    async def initialize(self):
        print("Mock Agent initialized")
        
    async def close(self):
        print("Mock Agent closed")
        
    async def create_invitation(self):
        connection_id = f"connection-{os.urandom(4).hex()}"
        invitation = {
            "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
            "@id": f"invitation-{os.urandom(4).hex()}",
            "label": "ChainFlow Verifier",
            "recipientKeys": ["mock-key-1"],
            "serviceEndpoint": self.endpoint,
            "routingKeys": []
        }
        return {
            "connection_id": connection_id,
            "invitation": invitation
        }
        
    async def request_proof(self, connection_id, proof_request):
        return f"proof-{os.urandom(4).hex()}"

# Initialize mock agent
agent = MockAgent(
    endpoint=os.getenv("AGENT_ENDPOINT", "http://localhost:8000"),
    wallet_name=os.getenv("WALLET_NAME", "chainflow_verifier"),
    wallet_key=os.getenv("WALLET_KEY", "chainflow_verifier_key"),
    pool_name=os.getenv("POOL_NAME", "sandbox"),
    genesis_file=os.getenv("GENESIS_FILE", "./genesis.txn")
)

# Store active connections and proofs
active_connections = {}
active_proofs = {}

@app.on_event("startup")
async def startup_event():
    """Initialize the agent on startup"""
    await agent.initialize()
    print("ChainFlow SSI Login System started")

@app.on_event("shutdown")
async def shutdown_event():
    """Close the agent on shutdown"""
    await agent.close()
    print("ChainFlow SSI Login System stopped")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the login page"""
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/api/login/init")
async def init_login():
    """Initialize the login process by creating an invitation"""
    # Create an invitation for the user to connect
    invitation = await agent.create_invitation()
    
    # Store the connection ID
    connection_id = invitation["connection_id"]
    active_connections[connection_id] = {
        "created_at": datetime.now(),
        "status": "invited"
    }
    
    return {
        "connection_id": connection_id,
        "invitation": invitation["invitation"],
        "status": "invitation_created"
    }

@app.get("/api/login/status/{connection_id}")
async def check_login_status(connection_id: str):
    """Check the status of a login process"""
    if connection_id not in active_connections:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    # Check if connection is established
    connection = active_connections[connection_id]
    
    # For demo purposes, automatically progress the status
    current_status = connection["status"]
    
    # Simulate status progression for demo
    if current_status == "invited":
        # Simulate connection acceptance after 3 seconds
        if (datetime.now() - connection["created_at"]).total_seconds() > 3:
            connection["status"] = "connected"
            current_status = "connected"
    
    # If connection is established but proof not requested yet
    if current_status == "connected" and connection_id not in active_proofs:
        # Create and send proof request
        proof_id = await agent.request_proof(connection_id, {"name": "ChainFlow Login Proof"})
        
        active_proofs[connection_id] = {
            "proof_id": proof_id,
            "created_at": datetime.now(),
            "status": "requested"
        }
        
        return {"status": "proof_requested", "connection_id": connection_id, "proof_id": proof_id}
    
    # If proof is already requested, simulate verification
    if connection_id in active_proofs:
        proof = active_proofs[connection_id]
        
        # Simulate proof verification after 5 seconds
        if proof["status"] == "requested" and (datetime.now() - proof["created_at"]).total_seconds() > 5:
            proof["status"] = "verified"
            proof["did"] = "did:sov:2wJPyULfLLnYTEFYzByfUR"
            proof["expiry_date"] = (datetime.now() + timedelta(days=365)).isoformat()
        
        if proof["status"] == "verified":
            # Return successful login
            return {
                "status": "login_successful",
                "connection_id": connection_id,
                "did": proof.get("did"),
                "proof_id": proof.get("proof_id"),
                "expiry_date": proof.get("expiry_date")
            }
    
    # Return current status
    return {"status": connection["status"], "connection_id": connection_id}

@app.post("/webhooks/topic/{topic}")
async def handle_webhook(topic: str, request: Request):
    """Handle webhooks from the agent"""
    try:
        payload = await request.json()
        
        if topic == "connections":
            connection_id = payload.get("connection_id")
            state = payload.get("state")
            
            if connection_id in active_connections:
                active_connections[connection_id]["status"] = state
                print(f"Connection {connection_id} state changed to {state}")
        
        elif topic == "present_proof":
            proof_id = payload.get("presentation_exchange_id")
            state = payload.get("state")
            connection_id = payload.get("connection_id")
            
            # Find the connection for this proof
            for conn_id, proof_data in active_proofs.items():
                if proof_data.get("proof_id") == proof_id:
                    active_proofs[conn_id]["status"] = state
                    
                    # If proof is verified, extract and store relevant information
                    if state == "verified":
                        presentation = payload.get("presentation", {})
                        revealed_attrs = presentation.get("requested_proof", {}).get("revealed_attrs", {})
                        
                        # Extract DID and expiry date
                        did = revealed_attrs.get("did", {}).get("raw")
                        expiry_date = revealed_attrs.get("expiry_date", {}).get("raw")
                        
                        active_proofs[conn_id]["did"] = did
                        active_proofs[conn_id]["expiry_date"] = expiry_date
                        
                        print(f"Proof {proof_id} verified for connection {conn_id}")
    except Exception as e:
        print(f"Error processing webhook: {e}")
        
    return {}

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Render the dashboard page (after successful login)"""
    return templates.TemplateResponse("dashboard.html", {"request": request})

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True
    )
