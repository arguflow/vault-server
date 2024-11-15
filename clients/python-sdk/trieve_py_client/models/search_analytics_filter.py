# coding: utf-8

"""
    Trieve API

    Trieve OpenAPI Specification. This document describes all of the operations available through the Trieve API.

    The version of the OpenAPI document: 0.12.0
    Contact: developers@trieve.ai
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from pydantic import BaseModel, ConfigDict
from typing import Any, ClassVar, Dict, List, Optional
from trieve_py_client.models.date_range import DateRange
from trieve_py_client.models.search_method import SearchMethod
from trieve_py_client.models.search_type import SearchType
from typing import Optional, Set
from typing_extensions import Self

class SearchAnalyticsFilter(BaseModel):
    """
    SearchAnalyticsFilter
    """ # noqa: E501
    date_range: Optional[DateRange] = None
    search_method: Optional[SearchMethod] = None
    search_type: Optional[SearchType] = None
    __properties: ClassVar[List[str]] = ["date_range", "search_method", "search_type"]

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
        """Create an instance of SearchAnalyticsFilter from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of date_range
        if self.date_range:
            _dict['date_range'] = self.date_range.to_dict()
        # set to None if date_range (nullable) is None
        # and model_fields_set contains the field
        if self.date_range is None and "date_range" in self.model_fields_set:
            _dict['date_range'] = None

        # set to None if search_method (nullable) is None
        # and model_fields_set contains the field
        if self.search_method is None and "search_method" in self.model_fields_set:
            _dict['search_method'] = None

        # set to None if search_type (nullable) is None
        # and model_fields_set contains the field
        if self.search_type is None and "search_type" in self.model_fields_set:
            _dict['search_type'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of SearchAnalyticsFilter from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "date_range": DateRange.from_dict(obj["date_range"]) if obj.get("date_range") is not None else None,
            "search_method": obj.get("search_method"),
            "search_type": obj.get("search_type")
        })
        return _obj


