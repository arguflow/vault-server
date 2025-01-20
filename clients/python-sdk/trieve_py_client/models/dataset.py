# coding: utf-8

"""
    Trieve API

    Trieve OpenAPI Specification. This document describes all of the operations available through the Trieve API.

    The version of the OpenAPI document: 0.13.0
    Contact: developers@trieve.ai
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from typing import Optional, Set
from typing_extensions import Self

class Dataset(BaseModel):
    """
    Dataset
    """ # noqa: E501
    created_at: datetime = Field(description="Timestamp of the creation of the dataset")
    deleted: StrictInt = Field(description="Flag to indicate if the dataset has been deleted. Deletes are handled async after the flag is set so as to avoid expensive search index compaction.")
    id: StrictStr = Field(description="Unique identifier of the dataset, auto-generated uuid created by Trieve")
    name: StrictStr = Field(description="Name of the dataset")
    organization_id: StrictStr = Field(description="Unique identifier of the organization that owns the dataset")
    server_configuration: Optional[Any] = Field(description="Configuration of the dataset for RAG, embeddings, BM25, etc.")
    tracking_id: Optional[StrictStr] = Field(default=None, description="Tracking ID of the dataset, can be any string, determined by the user. Tracking ID's are unique identifiers for datasets within an organization. They are designed to match the unique identifier of the dataset in the user's system.")
    updated_at: datetime = Field(description="Timestamp of the last update of the dataset")
    __properties: ClassVar[List[str]] = ["created_at", "deleted", "id", "name", "organization_id", "server_configuration", "tracking_id", "updated_at"]

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        protected_namespaces=(),
    )


    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Optional[Self]:
        """Create an instance of Dataset from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        excluded_fields: Set[str] = set([
        ])

        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )
        # set to None if server_configuration (nullable) is None
        # and model_fields_set contains the field
        if self.server_configuration is None and "server_configuration" in self.model_fields_set:
            _dict['server_configuration'] = None

        # set to None if tracking_id (nullable) is None
        # and model_fields_set contains the field
        if self.tracking_id is None and "tracking_id" in self.model_fields_set:
            _dict['tracking_id'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of Dataset from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "created_at": obj.get("created_at"),
            "deleted": obj.get("deleted"),
            "id": obj.get("id"),
            "name": obj.get("name"),
            "organization_id": obj.get("organization_id"),
            "server_configuration": obj.get("server_configuration"),
            "tracking_id": obj.get("tracking_id"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


