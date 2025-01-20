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

from pydantic import BaseModel, ConfigDict, StrictFloat, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional, Union
from trieve_py_client.models.clickhouse_recommendation_types import ClickhouseRecommendationTypes
from typing import Optional, Set
from typing_extensions import Self

class RecommendationEvent(BaseModel):
    """
    RecommendationEvent
    """ # noqa: E501
    created_at: StrictStr
    dataset_id: StrictStr
    id: StrictStr
    negative_ids: List[StrictStr]
    negative_tracking_ids: List[StrictStr]
    positive_ids: List[StrictStr]
    positive_tracking_ids: List[StrictStr]
    recommendation_type: ClickhouseRecommendationTypes
    request_params: Optional[Any]
    results: List[Any]
    top_score: Union[StrictFloat, StrictInt]
    user_id: StrictStr
    __properties: ClassVar[List[str]] = ["created_at", "dataset_id", "id", "negative_ids", "negative_tracking_ids", "positive_ids", "positive_tracking_ids", "recommendation_type", "request_params", "results", "top_score", "user_id"]

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
        """Create an instance of RecommendationEvent from a JSON string"""
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
        # set to None if request_params (nullable) is None
        # and model_fields_set contains the field
        if self.request_params is None and "request_params" in self.model_fields_set:
            _dict['request_params'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of RecommendationEvent from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "created_at": obj.get("created_at"),
            "dataset_id": obj.get("dataset_id"),
            "id": obj.get("id"),
            "negative_ids": obj.get("negative_ids"),
            "negative_tracking_ids": obj.get("negative_tracking_ids"),
            "positive_ids": obj.get("positive_ids"),
            "positive_tracking_ids": obj.get("positive_tracking_ids"),
            "recommendation_type": obj.get("recommendation_type"),
            "request_params": obj.get("request_params"),
            "results": obj.get("results"),
            "top_score": obj.get("top_score"),
            "user_id": obj.get("user_id")
        })
        return _obj


