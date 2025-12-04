import http from "../http-common";

class ApiService {
  // getMany(params) {
  //   return http.get("generic/get-list",{params});
  // }

  // getById(id,params) {
  //   return http.get(`generic/get-by-id/${id}`,{params});
  // }


//  Unified entity getter
//  @param {string} model - model name (e.g. "LEAD_MODEL")
//  @param {Object} filter - optional filter object (e.g. { flatId: 36 })
//  @returns {Promise<Object|Array>} Single object or array
// 

clientGetEntities(
  model,
  {
    filter = {},
    sort,
    limit,
    skip,
    select,
    populate,
    lean,
  } = {}
) {
  const params = { model };

  // filter – JSON string אם יש פילטר מפורש
  if (filter && Object.keys(filter).length) {
    params.filter = JSON.stringify(filter);
  }

  // options
  if (sort) {
    params._sort = JSON.stringify(sort);
  }

  if (typeof limit !== "undefined") {
    params._limit = limit;
  }

  if (typeof skip !== "undefined") {
    params._skip = skip;
  }

  if (select) {
    params._select = select;
  }

  if (populate) {
    params._populate = JSON.stringify(populate);
  }

  if (typeof lean !== "undefined") {
    params._lean = lean;
  }

  return http.get("generic/entity", { params });
}


  create(data,params) {
    return http.post("generic/create", data, {params});
  }

  // update(id, data,params) {
  //   return http.put(`generic/update/${id}`, data, {params});
  // }

  updateEntity(filter, data, params) {
    return http.put("generic/update", { filter, data }, { params });
  }

  deleteOne(params) {
    return http.delete(`generic/delete`,{params});
  }

  deleteAll(params) {
    return http.delete(`generic/delete-all`,{params});
  }
}

export default new ApiService();