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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictFloat, StrictInt
from typing import Any, ClassVar, Dict, List, Optional, Union
from typing_extensions import Annotated
from trieve_py_client.models.chunk_filter import ChunkFilter
from trieve_py_client.models.count_search_method import CountSearchMethod
from trieve_py_client.models.query_types import QueryTypes
from typing import Optional, Set
from typing_extensions import Self

class CountChunksReqPayload(BaseModel):
    """
    CountChunksReqPayload
    """ # noqa: E501
    filters: Optional[ChunkFilter] = None
    limit: Optional[Annotated[int, Field(strict=True, ge=0)]] = Field(default=None, description="Set limit to restrict the maximum number of chunks to count. This is useful for when you want to reduce the latency of the count operation. By default the limit will be the number of chunks in the dataset.")
    query: QueryTypes
    score_threshold: Optional[Union[StrictFloat, StrictInt]] = Field(default=None, description="Set score_threshold to a float to filter out chunks with a score below the threshold. This threshold applies before weight and bias modifications. If not specified, this defaults to 0.0.")
    search_type: CountSearchMethod
    use_quote_negated_terms: Optional[StrictBool] = Field(default=None, description="If true, quoted and - prefixed words will be parsed from the queries and used as required and negated words respectively. Default is false.")
    __properties: ClassVar[List[str]] = ["filters", "limit", "query", "score_threshold", "search_type", "use_quote_negated_terms"]

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
        """Create an instance of CountChunksReqPayload from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of filters
        if self.filters:
            _dict['filters'] = self.filters.to_dict()
        # override the default output from pydantic by calling `to_dict()` of query
        if self.query:
            _dict['query'] = self.query.to_dict()
        # set to None if filters (nullable) is None
        # and model_fields_set contains the field
        if self.filters is None and "filters" in self.model_fields_set:
            _dict['filters'] = None

        # set to None if limit (nullable) is None
        # and model_fields_set contains the field
        if self.limit is None and "limit" in self.model_fields_set:
            _dict['limit'] = None

        # set to None if score_threshold (nullable) is None
        # and model_fields_set contains the field
        if self.score_threshold is None and "score_threshold" in self.model_fields_set:
            _dict['score_threshold'] = None

        # set to None if use_quote_negated_terms (nullable) is None
        # and model_fields_set contains the field
        if self.use_quote_negated_terms is None and "use_quote_negated_terms" in self.model_fields_set:
            _dict['use_quote_negated_terms'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of CountChunksReqPayload from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "filters": ChunkFilter.from_dict(obj["filters"]) if obj.get("filters") is not None else None,
            "limit": obj.get("limit"),
            "query": QueryTypes.from_dict(obj["query"]) if obj.get("query") is not None else None,
            "score_threshold": obj.get("score_threshold"),
            "search_type": obj.get("search_type"),
            "use_quote_negated_terms": obj.get("use_quote_negated_terms")
        })
        return _obj


