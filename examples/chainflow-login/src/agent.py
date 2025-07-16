#!/usr/bin/env python3
import json
import asyncio
import os
from typing import Dict, Any, Optional, List

# Indy SDK imports
import indy
from indy import wallet, did, pool, ledger, anoncreds

class Agent:
    """
    Agent class for handling interactions with Hyperledger Indy
    """
    def __init__(
        self, 
        endpoint: str, 
        wallet_name: str, 
        wallet_key: str, 
        pool_name: str, 
        genesis_file: str
    ):
        """
        Initialize the agent with the given parameters
        
        Args:
            endpoint: The endpoint where the agent is accessible
            wallet_name: The name of the wallet to use
            wallet_key: The key for the wallet
            pool_name: The name of the pool to connect to
            genesis_file: Path to the genesis transaction file
        """
        self.endpoint = endpoint
        self.wallet_name = wallet_name
        self.wallet_key = wallet_key
        self.pool_name = pool_name
        self.genesis_file = genesis_file
        
        self.wallet_handle = None
        self.pool_handle = None
        self.did = None
        self.verkey = None
        
    async def initialize(self):
        """Initialize the agent by setting up the pool and wallet"""
        # Set up the pool
        await self._setup_pool()
        
        # Set up the wallet
        await self._setup_wallet()
        
        # Set up the DID
        await self._setup_did()
        
        print(f"Agent initialized with DID: {self.did}")
        
    async def close(self):
        """Close the wallet and pool connections"""
        if self.wallet_handle:
            await wallet.close_wallet(self.wallet_handle)
            
        if self.pool_handle:
            await pool.close_pool_ledger(self.pool_handle)
            
    async def _setup_pool(self):
        """Set up the connection to the Indy pool"""
        try:
            await pool.set_protocol_version(2)
            
            # Check if pool exists
            pools = json.loads(await pool.list_pools())
            pool_exists = any(p['pool'] == self.pool_name for p in pools)
            
            if not pool_exists:
                # Create pool ledger config
                await pool.create_pool_ledger_config(
                    config_name=self.pool_name,
                    config=json.dumps({
                        "genesis_txn": self.genesis_file
                    })
                )
            
            # Open pool ledger
            self.pool_handle = await pool.open_pool_ledger(self.pool_name, None)
            print(f"Connected to pool: {self.pool_name}")
            
        except Exception as e:
            print(f"Error setting up pool: {e}")
            raise
            
    async def _setup_wallet(self):
        """Set up the agent's wallet"""
        try:
            # Check if wallet exists
            try:
                await wallet.create_wallet(
                    config=json.dumps({
                        "id": self.wallet_name
                    }),
                    credentials=json.dumps({
                        "key": self.wallet_key
                    })
                )
                print(f"Created wallet: {self.wallet_name}")
            except indy.error.IndyError as e:
                if e.error_code == indy.error.ErrorCode.WalletAlreadyExistsError:
                    print(f"Wallet {self.wallet_name} already exists")
                else:
                    raise
            
            # Open wallet
            self.wallet_handle = await wallet.open_wallet(
                config=json.dumps({
                    "id": self.wallet_name
                }),
                credentials=json.dumps({
                    "key": self.wallet_key
                })
            )
            print(f"Opened wallet: {self.wallet_name}")
            
        except Exception as e:
            print(f"Error setting up wallet: {e}")
            raise
            
    async def _setup_did(self):
        """Set up the agent's DID"""
        try:
            # Check if we already have a DID
            dids = json.loads(await did.list_my_dids_with_meta(self.wallet_handle))
            
            if dids:
                # Use existing DID
                self.did = dids[0]['did']
                self.verkey = dids[0]['verkey']
                print(f"Using existing DID: {self.did}")
            else:
                # Create new DID
                did_json = json.dumps({'seed': '000000000000000000000000Steward1'})
                result = await did.create_and_store_my_did(self.wallet_handle, did_json)
                self.did, self.verkey = result
                print(f"Created new DID: {self.did}")
                
                # Register DID on ledger (in a real system, this would be done by a proper onboarding process)
                nym_request = await ledger.build_nym_request(
                    submitter_did=self.did,
                    target_did=self.did,
                    ver_key=self.verkey,
                    alias=None,
                    role='TRUST_ANCHOR'
                )
                
                await ledger.sign_and_submit_request(
                    pool_handle=self.pool_handle,
                    wallet_handle=self.wallet_handle,
                    submitter_did=self.did,
                    request_json=nym_request
                )
                
        except Exception as e:
            print(f"Error setting up DID: {e}")
            raise
            
    async def create_invitation(self) -> Dict[str, Any]:
        """
        Create an invitation for a connection
        
        Returns:
            Dict containing the invitation and connection_id
        """
        # In a real implementation, this would use DIDComm to create an invitation
        # For this example, we'll simulate it
        connection_id = f"connection-{os.urandom(4).hex()}"
        
        invitation = {
            "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
            "@id": f"invitation-{os.urandom(4).hex()}",
            "label": "ChainFlow Verifier",
            "recipientKeys": [self.verkey],
            "serviceEndpoint": self.endpoint,
            "routingKeys": []
        }
        
        return {
            "connection_id": connection_id,
            "invitation": invitation
        }
        
    async def request_proof(self, connection_id: str, proof_request: Dict[str, Any]) -> str:
        """
        Request a proof from a connection
        
        Args:
            connection_id: The ID of the connection to request the proof from
            proof_request: The proof request to send
            
        Returns:
            The ID of the proof request
        """
        # In a real implementation, this would use DIDComm to send a proof request
        # For this example, we'll simulate it
        proof_id = f"proof-{os.urandom(4).hex()}"
        
        # In a real implementation, we would send the proof request to the connection
        # and store it in a database
        
        return proof_id
        
    async def verify_proof(self, proof_id: str, proof: Dict[str, Any]) -> bool:
        """
        Verify a proof
        
        Args:
            proof_id: The ID of the proof to verify
            proof: The proof to verify
            
        Returns:
            True if the proof is valid, False otherwise
        """
        # In a real implementation, this would use anoncreds to verify the proof
        # For this example, we'll simulate it
        
        # Simulate verification logic
        is_valid = True
        
        return is_valid
