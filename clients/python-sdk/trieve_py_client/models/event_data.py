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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from typing import Optional, Set
from typing_extensions import Self

class EventData(BaseModel):
    """
    EventData represents a single analytics event
    """ # noqa: E501
    created_at: StrictStr = Field(description="The time the event was created.")
    dataset_id: StrictStr = Field(description="The unique identifier for the dataset the event is associated with.")
    event_name: StrictStr = Field(description="The name of the event, e.g. \"Added to Cart\", \"Purchased\", \"Viewed Home Page\", \"Clicked\", \"Filter Clicked\".")
    event_type: StrictStr = Field(description="The type of event, \"add_to_cart\", \"purchase\", \"view\", \"click\", \"filter_clicked\".")
    id: StrictStr = Field(description="The unique identifier for the event")
    is_conversion: Optional[StrictBool] = Field(default=None, description="Whether the event is a conversion event.")
    items: List[StrictStr] = Field(description="The items associated with the event. This could be a list of stringified json chunks for search events, or a list of items for add_to_cart, purchase, view, and click events.")
    metadata: Optional[Any] = Field(default=None, description="Additional metadata associated with the event. This can be custom data that is specific to the event.")
    request_id: Optional[StrictStr] = Field(default=None, description="The unique identifier for the request the event is associated with.")
    request_type: Optional[StrictStr] = Field(default=None, description="The type of request the event is associated with.")
    updated_at: StrictStr = Field(description="The time the event was last updated.")
    user_id: Optional[StrictStr] = Field(default=None, description="The user identifier associated with the event.")
    __properties: ClassVar[List[str]] = ["created_at", "dataset_id", "event_name", "event_type", "id", "is_conversion", "items", "metadata", "request_id", "request_type", "updated_at", "user_id"]

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
        """Create an instance of EventData from a JSON string"""
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
        # set to None if is_conversion (nullable) is None
        # and model_fields_set contains the field
        if self.is_conversion is None and "is_conversion" in self.model_fields_set:
            _dict['is_conversion'] = None

        # set to None if metadata (nullable) is None
        # and model_fields_set contains the field
        if self.metadata is None and "metadata" in self.model_fields_set:
            _dict['metadata'] = None

        # set to None if request_id (nullable) is None
        # and model_fields_set contains the field
        if self.request_id is None and "request_id" in self.model_fields_set:
            _dict['request_id'] = None

        # set to None if request_type (nullable) is None
        # and model_fields_set contains the field
        if self.request_type is None and "request_type" in self.model_fields_set:
            _dict['request_type'] = None

        # set to None if user_id (nullable) is None
        # and model_fields_set contains the field
        if self.user_id is None and "user_id" in self.model_fields_set:
            _dict['user_id'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of EventData from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "created_at": obj.get("created_at"),
            "dataset_id": obj.get("dataset_id"),
            "event_name": obj.get("event_name"),
            "event_type": obj.get("event_type"),
            "id": obj.get("id"),
            "is_conversion": obj.get("is_conversion"),
            "items": obj.get("items"),
            "metadata": obj.get("metadata"),
            "request_id": obj.get("request_id"),
            "request_type": obj.get("request_type"),
            "updated_at": obj.get("updated_at"),
            "user_id": obj.get("user_id")
        })
        return _obj


