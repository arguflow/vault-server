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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictFloat, StrictInt, StrictStr, field_validator
from typing import Any, ClassVar, Dict, List, Optional, Union
from trieve_py_client.models.request_info import RequestInfo
from typing import Optional, Set
from typing_extensions import Self

class Purchase(BaseModel):
    """
    Purchase
    """ # noqa: E501
    currency: Optional[StrictStr] = Field(default=None, description="The currency of the purchase")
    event_name: StrictStr = Field(description="The name of the event")
    event_type: StrictStr
    is_conversion: Optional[StrictBool] = Field(default=None, description="Whether the event is a conversion event")
    items: List[StrictStr] = Field(description="The items that were purchased")
    request: Optional[RequestInfo] = None
    user_id: Optional[StrictStr] = Field(default=None, description="The user id of the user who purchased the items")
    value: Optional[Union[StrictFloat, StrictInt]] = Field(default=None, description="The value of the purchase")
    __properties: ClassVar[List[str]] = ["currency", "event_name", "event_type", "is_conversion", "items", "request", "user_id", "value"]

    @field_validator('event_type')
    def event_type_validate_enum(cls, value):
        """Validates the enum"""
        if value not in set(['purchase']):
            raise ValueError("must be one of enum values ('purchase')")
        return value

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
        """Create an instance of Purchase from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of request
        if self.request:
            _dict['request'] = self.request.to_dict()
        # set to None if currency (nullable) is None
        # and model_fields_set contains the field
        if self.currency is None and "currency" in self.model_fields_set:
            _dict['currency'] = None

        # set to None if is_conversion (nullable) is None
        # and model_fields_set contains the field
        if self.is_conversion is None and "is_conversion" in self.model_fields_set:
            _dict['is_conversion'] = None

        # set to None if request (nullable) is None
        # and model_fields_set contains the field
        if self.request is None and "request" in self.model_fields_set:
            _dict['request'] = None

        # set to None if user_id (nullable) is None
        # and model_fields_set contains the field
        if self.user_id is None and "user_id" in self.model_fields_set:
            _dict['user_id'] = None

        # set to None if value (nullable) is None
        # and model_fields_set contains the field
        if self.value is None and "value" in self.model_fields_set:
            _dict['value'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of Purchase from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "currency": obj.get("currency"),
            "event_name": obj.get("event_name"),
            "event_type": obj.get("event_type"),
            "is_conversion": obj.get("is_conversion"),
            "items": obj.get("items"),
            "request": RequestInfo.from_dict(obj["request"]) if obj.get("request") is not None else None,
            "user_id": obj.get("user_id"),
            "value": obj.get("value")
        })
        return _obj


