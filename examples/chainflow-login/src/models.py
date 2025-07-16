#!/usr/bin/env python3
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class LoginRequest(BaseModel):
    """Request model for initiating a login"""
    connection_type: str = Field(default="did", description="Type of connection to establish")

class LoginResponse(BaseModel):
    """Response model for login initiation"""
    connection_id: str = Field(..., description="ID of the established connection")
    invitation: Dict[str, Any] = Field(..., description="Connection invitation to be used by the wallet")
    status: str = Field(..., description="Status of the login process")

class ProofRequest(BaseModel):
    """Model for a proof request"""
    name: str = Field(..., description="Name of the proof request")
    version: str = Field(..., description="Version of the proof request")
    requested_attributes: Dict[str, Any] = Field(..., description="Attributes requested in the proof")
    requested_predicates: Dict[str, Any] = Field(default={}, description="Predicates requested in the proof")
    non_revoked: Optional[Dict[str, int]] = Field(default=None, description="Non-revocation interval")

class ProofResponse(BaseModel):
    """Model for a proof response"""
    proof_id: str = Field(..., description="ID of the proof")
    connection_id: str = Field(..., description="ID of the connection")
    status: str = Field(..., description="Status of the proof")
    revealed_attrs: Dict[str, Any] = Field(default={}, description="Revealed attributes in the proof")

class UserCredential(BaseModel):
    """Model for a user credential"""
    did: str = Field(..., description="Decentralized Identifier of the user")
    proof_id: str = Field(..., description="ID of the proof used for login")
    expiry_date: Optional[datetime] = Field(default=None, description="Expiry date of the credential")
    login_time: datetime = Field(default_factory=datetime.now, description="Time of login")
