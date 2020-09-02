import { keys } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Card, Message, Segment } from 'semantic-ui-react';

const messages = defineMessages({
  editValues: {
    id: 'Edit values',
    defaultMessage: 'Edit values',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  thereWereSomeErrors: {
    id: 'There were some errors',
    defaultMessage: 'There were some errors',
  },
});

const InlineForm = ({
  description,
  error, // Such as {message: "It's not good"}
  errors = {},
  formData,
  title,
  icon,
  headerActions,
  intl,
}) => {
  const _ = intl.formatMessage;
  // console.log('formdata', formData);
  return (
    <Segment.Group raised className="form">
      <header className="header pulled">
        {icon}
        <h2>{title || _(messages.editValues)}</h2>
        {headerActions}
      </header>
      {description && (
        <Segment secondary className="attached">
          {description}
        </Segment>
      )}
      {keys(errors).length > 0 && (
        <Message
          icon="warning"
          negative
          attached
          header={_(messages.error)}
          content={_(messages.thereWereSomeErrors)}
        />
      )}
      {error && (
        <Message
          icon="warning"
          negative
          attached
          header={_(messages.error)}
          content={error.message}
        />
      )}

      <div id={`blockform-fieldset-default`}>
        <Segment className="attached">
          <Card fluid>
            <Card.Content>
              <Card.Header>Citation</Card.Header>
              <Card.Description>{formData.footnoteTitle}</Card.Description>
            </Card.Content>
          </Card>
        </Segment>
      </div>
    </Segment.Group>
  );
};

InlineForm.defaultProps = {
  block: null,
  description: null,
  formData: null,
  onChangeField: null,
  error: null,
  errors: {},
  schema: {},
};

InlineForm.propTypes = {
  block: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.shape({
    fieldsets: PropTypes.arrayOf(
      PropTypes.shape({
        fields: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    properties: PropTypes.objectOf(PropTypes.any),
    definitions: PropTypes.objectOf(PropTypes.any),
    required: PropTypes.arrayOf(PropTypes.string),
  }),
  formData: PropTypes.objectOf(PropTypes.any),
  pathname: PropTypes.string,
  onChangeField: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

export default injectIntl(InlineForm, { forwardRef: true });
