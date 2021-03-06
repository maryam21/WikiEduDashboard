import React from 'react';
import YesNoSelector from './yes_no_selector';

const WithdrawnSelector = ({ course, editable }) => {
  if (!editable || !Features.wikiEd) {
    return null;
  }
  return (
    <YesNoSelector
      courseProperty="withdrawn"
      label={I18n.t("courses.withdrawn")}
      course={course}
      editable={editable}
    />
  );
};

export default WithdrawnSelector;
