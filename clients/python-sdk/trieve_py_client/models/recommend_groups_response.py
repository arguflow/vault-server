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
import json
import pprint
from pydantic import BaseModel, ConfigDict, Field, StrictStr, ValidationError, field_validator
from typing import Any, List, Optional
from trieve_py_client.models.group_score_chunk import GroupScoreChunk
from trieve_py_client.models.recommend_groups_response_body import RecommendGroupsResponseBody
from pydantic import StrictStr, Field
from typing import Union, List, Optional, Dict
from typing_extensions import Literal, Self

RECOMMENDGROUPSRESPONSE_ONE_OF_SCHEMAS = ["GroupScoreChunk", "RecommendGroupsResponseBody"]

class RecommendGroupsResponse(BaseModel):
    """
    RecommendGroupsResponse
    """
    # data type: RecommendGroupsResponseBody
    oneof_schema_1_validator: Optional[RecommendGroupsResponseBody] = None
    # data type: GroupScoreChunk
    oneof_schema_2_validator: Optional[GroupScoreChunk] = None
    actual_instance: Optional[Union[GroupScoreChunk, RecommendGroupsResponseBody]] = None
    one_of_schemas: List[str] = Field(default=Literal["GroupScoreChunk", "RecommendGroupsResponseBody"])

    model_config = ConfigDict(
        validate_assignment=True,
        protected_namespaces=(),
    )


    def __init__(self, *args, **kwargs) -> None:
        if args:
            if len(args) > 1:
                raise ValueError("If a position argument is used, only 1 is allowed to set `actual_instance`")
            if kwargs:
                raise ValueError("If a position argument is used, keyword arguments cannot be used.")
            super().__init__(actual_instance=args[0])
        else:
            super().__init__(**kwargs)

    @field_validator('actual_instance')
    def actual_instance_must_validate_oneof(cls, v):
        instance = RecommendGroupsResponse.model_construct()
        error_messages = []
        match = 0
        # validate data type: RecommendGroupsResponseBody
        if not isinstance(v, RecommendGroupsResponseBody):
            error_messages.append(f"Error! Input type `{type(v)}` is not `RecommendGroupsResponseBody`")
        else:
            match += 1
        # validate data type: GroupScoreChunk
        if not isinstance(v, GroupScoreChunk):
            error_messages.append(f"Error! Input type `{type(v)}` is not `GroupScoreChunk`")
        else:
            match += 1
        if match > 1:
            # more than 1 match
            raise ValueError("Multiple matches found when setting `actual_instance` in RecommendGroupsResponse with oneOf schemas: GroupScoreChunk, RecommendGroupsResponseBody. Details: " + ", ".join(error_messages))
        elif match == 0:
            # no match
            raise ValueError("No match found when setting `actual_instance` in RecommendGroupsResponse with oneOf schemas: GroupScoreChunk, RecommendGroupsResponseBody. Details: " + ", ".join(error_messages))
        else:
            return v

    @classmethod
    def from_dict(cls, obj: Union[str, Dict[str, Any]]) -> Self:
        return cls.from_json(json.dumps(obj))

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Returns the object represented by the json string"""
        instance = cls.model_construct()
        error_messages = []
        match = 0

        # deserialize data into RecommendGroupsResponseBody
        try:
            instance.actual_instance = RecommendGroupsResponseBody.from_json(json_str)
            match += 1
        except (ValidationError, ValueError) as e:
            error_messages.append(str(e))
        # deserialize data into GroupScoreChunk
        try:
            instance.actual_instance = GroupScoreChunk.from_json(json_str)
            match += 1
        except (ValidationError, ValueError) as e:
            error_messages.append(str(e))

        if match > 1:
            # more than 1 match
            raise ValueError("Multiple matches found when deserializing the JSON string into RecommendGroupsResponse with oneOf schemas: GroupScoreChunk, RecommendGroupsResponseBody. Details: " + ", ".join(error_messages))
        elif match == 0:
            # no match
            raise ValueError("No match found when deserializing the JSON string into RecommendGroupsResponse with oneOf schemas: GroupScoreChunk, RecommendGroupsResponseBody. Details: " + ", ".join(error_messages))
        else:
            return instance

    def to_json(self) -> str:
        """Returns the JSON representation of the actual instance"""
        if self.actual_instance is None:
            return "null"

        if hasattr(self.actual_instance, "to_json") and callable(self.actual_instance.to_json):
            return self.actual_instance.to_json()
        else:
            return json.dumps(self.actual_instance)

    def to_dict(self) -> Optional[Union[Dict[str, Any], GroupScoreChunk, RecommendGroupsResponseBody]]:
        """Returns the dict representation of the actual instance"""
        if self.actual_instance is None:
            return None

        if hasattr(self.actual_instance, "to_dict") and callable(self.actual_instance.to_dict):
            return self.actual_instance.to_dict()
        else:
            # primitive type
            return self.actual_instance

    def to_str(self) -> str:
        """Returns the string representation of the actual instance"""
        return pprint.pformat(self.model_dump())


