#!/usr/bin/env python3
import json
import os
import time
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

def generate_proof_request() -> Dict[str, Any]:
    """
    Generate a proof request for the ChainFlow login
    
    Returns:
        A proof request object
    """
    # Current time in seconds since epoch
    now = int(time.time())
    
    # Proof request valid for 24 hours
    proof_request = {
        "name": "ChainFlow Login Proof",
        "version": "1.0",
        "nonce": str(int(time.time() * 1000)),
        "requested_attributes": {
            "did": {
                "name": "did",
                "restrictions": [
                    {
                        "cred_def_id": os.getenv("CHAINFLOW_CRED_DEF_ID", "")
                    }
                ]
            },
            "name": {
                "name": "name",
                "restrictions": [
                    {
                        "cred_def_id": os.getenv("CHAINFLOW_CRED_DEF_ID", "")
                    }
                ]
            },
            "expiry_date": {
                "name": "expiry_date",
                "restrictions": [
                    {
                        "cred_def_id": os.getenv("CHAINFLOW_CRED_DEF_ID", "")
                    }
                ]
            }
        },
        "requested_predicates": {
            "expiry_check": {
                "name": "expiry_date",
                "p_type": ">=",
                "p_value": now,
                "restrictions": [
                    {
                        "cred_def_id": os.getenv("CHAINFLOW_CRED_DEF_ID", "")
                    }
                ]
            }
        },
        "non_revoked": {
            "from": 0,
            "to": now
        }
    }
    
    return proof_request

def verify_proof(proof: Dict[str, Any]) -> bool:
    """
    Verify a proof
    
    Args:
        proof: The proof to verify
        
    Returns:
        True if the proof is valid, False otherwise
    """
    # In a real implementation, this would use the Indy SDK to verify the proof
    # For this example, we'll simulate it
    
    # Check if the proof contains the required attributes
    revealed_attrs = proof.get("requested_proof", {}).get("revealed_attrs", {})
    
    if "did" not in revealed_attrs or "expiry_date" not in revealed_attrs:
        return False
    
    # Check if the expiry date is in the future
    try:
        expiry_date_str = revealed_attrs["expiry_date"]["raw"]
        expiry_date = datetime.fromisoformat(expiry_date_str)
        
        if expiry_date < datetime.now():
            return False
    except (ValueError, KeyError):
        return False
    
    # In a real implementation, we would also verify the cryptographic proof
    # using the Indy SDK's anoncreds.verifier_verify_proof function
    
    return True

def format_did_for_display(did: str) -> str:
    """
    Format a DID for display by shortening it
    
    Args:
        did: The DID to format
        
    Returns:
        A formatted DID string
    """
    if not did or len(did) < 10:
        return did
    
    return f"{did[:6]}...{did[-4:]}"

def parse_expiry_date(expiry_date_str: str) -> Optional[datetime]:
    """
    Parse an expiry date string into a datetime object
    
    Args:
        expiry_date_str: The expiry date string to parse
        
    Returns:
        A datetime object or None if parsing fails
    """
    try:
        return datetime.fromisoformat(expiry_date_str)
    except ValueError:
        try:
            # Try parsing as timestamp
            timestamp = int(expiry_date_str)
            return datetime.fromtimestamp(timestamp)
        except ValueError:
            return None
