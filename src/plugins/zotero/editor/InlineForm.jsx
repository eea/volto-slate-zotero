import { keys } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Card, Message, Segment, List, Button } from 'semantic-ui-react';
import clearSVG from '@plone/volto/icons/delete.svg';
import { Icon } from '@plone/volto/components';

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
  updatedFormData,
  title,
  icon,
  headerActions,
  deleteItem,
  intl,
}) => {
  const _ = intl.formatMessage;

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
        <Segment className="attached slate-toolbar">
          <Card fluid>
            <Card.Content>
              <Card.Header>Citation</Card.Header>
              <Card.Description>
                {updatedFormData && (
                  <List divided relaxed className="button-wrapper">
                    {/* saved footnotes*/}
                    <List.Item>
                      <List.Content floated="right">
                        <Button
                          as="a"
                          size="tiny"
                          className="ui compact icon toggle button"
                          icon={<Icon name={clearSVG} size="24px" />}
                          onClick={() => deleteItem(-1)}
                        ></Button>
                      </List.Content>
                      <List.Content>
                        <List.Header>
                          {updatedFormData.footnoteTitle}{' '}
                        </List.Header>
                      </List.Content>
                    </List.Item>

                    {/* new footnotes*/}
                    {updatedFormData.extra &&
                      updatedFormData.extra.map((item, index) => (
                        <List.Item>
                          <List.Content floated="right">
                            <Button
                              as="a"
                              size="tiny"
                              className="ui compact icon toggle button"
                              icon={<Icon name={clearSVG} size="24px" />}
                              onClick={() => deleteItem(index)}
                            ></Button>
                          </List.Content>
                          <List.Content>
                            <List.Header>{item.footnoteTitle} </List.Header>
                          </List.Content>
                        </List.Item>
                      ))}
                  </List>
                )}
              </Card.Description>
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
