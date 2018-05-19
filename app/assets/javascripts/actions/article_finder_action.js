import _ from 'lodash';
import { RECEIVE_CATEGORY_RESULTS, CLEAR_FINDER_STATE, RECEIVE_ARTICLE_PAGEVIEWS, API_FAIL } from "../constants";
import { queryMediaWiki, categoryQueryGenerator, findSubcategories, pageviewQueryGenerator, queryPageviews } from '../utils/article_finder_utils.js';

export const fetchCategoryResults = (category, depth) => dispatch => {
  dispatch({
    type: CLEAR_FINDER_STATE
  });
  return getDataForCategory(`Category:${category}`, depth, 0, dispatch)
  .catch(response => (dispatch({ type: API_FAIL, data: response })));
};

const getDataForCategory = (category, depth, namespace = 0, dispatch) => {
  const query = categoryQueryGenerator(category, namespace);
  return queryMediaWiki(query)
  .then((data) => {
    if (depth > 0) {
        depth -= 1;
        getDataForSubCategories(category, depth, namespace, dispatch);
      }
    dispatch({
      type: RECEIVE_CATEGORY_RESULTS,
      data: data.query.categorymembers
    });
    return data.query.categorymembers;
  })
  .then((data) => {
    fetchPageViews(data, dispatch);
  });
};

const getDataForSubCategories = (category, depth, namespace, dispatch) => {
  return findSubcategories(category)
  .then((subcats) => {
    subcats.forEach((subcat) => {
      getDataForCategory(subcat.title, depth, namespace, dispatch);
    });
  });
};

const fetchPageViews = (articles, dispatch) => {
  articles.forEach((article) => {
    const queryUrl = pageviewQueryGenerator(article.title);
    queryPageviews(queryUrl)
    .then((data) => data.items)
    .then((data) => {
      const averagePageviews = Math.round((_.sumBy(data, (o) => { return o.views; }) / data.length) * 100) / 100;
      return { title: data[0].article, pageviews: averagePageviews };
    })
    .then((data) => {
      dispatch({
        type: RECEIVE_ARTICLE_PAGEVIEWS,
        data: data
      });
    })
    .catch(response => (dispatch({ type: API_FAIL, data: response })));
  });
};
