import React, { useState } from 'react';
import { render } from 'react-dom';
import { TextInput, Select, Option, Button, Table, TableBody, TableRow, TableHead, TableCell, TextLink, Modal, Checkbox } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  fields: Array<FGField>;
  newTypeField?: FGFieldType;
  modal: {
    showModal: Boolean;
    index?: number;
  }
}

enum FGFieldType {
  INPUT_TEXT = 'INPUT_TEXT',
  INPUT_EMAIL = 'INPUT_EMAIL',
  INPUT_NUMBER = 'INPUT_NUMBER',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  SELECT = 'SELECT',
  TEXTAREA = 'TEXTAREA'
}

interface FGFieldOption {
  value?: string;
  label: string;
}

interface FGField {
  zendDesk? : string;
  name? : string;
  label? : string;
  extraClassCss? : string;
  placeHolder? : string;
  type : FGFieldType;
  options?: Array<FGFieldOption>;
  required?: boolean;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    console.log( 'props.sdk.field.getValue', ( (props.sdk.field.getValue() ) ? true : false ) );
    this.state = {
      fields: ( ( props.sdk.field.getValue() ) ? JSON.parse( props.sdk.field.getValue() ) : [] ),
      modal: {
        showModal : false
      }
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    console.log('componentDidMount end');
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value: string) => {
    // this.setState({ value: JSON.parse(value) });
  };

  updateContentField = async () => {
    const value = JSON.stringify(this.state.fields);
    console.log(`updateContentField value`, value);
    if (value) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };

  updateFieldOnState = (idx: number, keyfield: string, value: any) => {
    const { fields, newTypeField, modal } = this.state;
    console.log(`updateFieldOnState idx=${idx} keyfield=${keyfield} value=${value}`);
    if ( fields && fields[idx] ) {
      fields[idx][keyfield] = value;
      this.setState({fields, newTypeField, modal});
    }
  }

  deleteFieldOnState = (idx: number) => {
    const { fields, newTypeField, modal } = this.state;
    fields.splice(idx, 1);
    this.setState({fields, modal, newTypeField: newTypeField});
  }

  renderFormFields = () => {
    const { fields, modal, newTypeField  } = this.state;
    console.log('renderFormFields');
    return fields && fields.length > 0 && <>
    <div>
      <Modal title="Centered modal" isShown={modal.showModal === true} onClose={() => {
        this.setState({fields, modal : {showModal : false}, newTypeField});
      }} shouldCloseOnOverlayClick={false} shouldCloseOnEscapePress={false}>
        aaaaaaaaaaaaaa
      </Modal>
    </div>
    <Table className="table-container">
      <TableHead>
        <TableCell>
          Type
        </TableCell>
        <TableCell>
          name
        </TableCell>
        <TableCell>
          label
        </TableCell>
        <TableCell>
          zendDesk param
        </TableCell>
        <TableCell>
          extra className
        </TableCell>
        <TableCell>
          required
        </TableCell>
        <TableCell>
          Options
        </TableCell>
      </TableHead>
      <TableBody>
      {fields.map( (field: FGField, index: number) => {
        return <TableRow key={index}>
          <TableCell>
            {field.type} <br />
            <TextLink linkType={'negative'} onClick={ e => {
              this.deleteFieldOnState(index);
            }}>Delete</TextLink>
          </TableCell>
          <TableCell>
            <TextInput value={field.name || ''} onChange={ e => {
              this.updateFieldOnState(index, 'name', e.target.value);
            }} />
          </TableCell>
          <TableCell>
            <TextInput value={field.label || ''} onChange={ e => {
              this.updateFieldOnState(index, 'label', e.target.value);
            }} />
          </TableCell>
          <TableCell>
            <TextInput value={field.zendDesk || ''} onChange={ e => {
              this.updateFieldOnState(index, 'zendDesk', e.target.value);
            }} />
          </TableCell>
          <TableCell>
            <TextInput value={field.extraClassCss || ''} onChange={ e => {
              this.updateFieldOnState(index, 'extraClassCss', e.target.value);
            }} />
          </TableCell>
          <TableCell>
            <Checkbox labelText={'Required?'} checked={field.required || false} onChange={ e => {
              console.log('Checkbox' , e.target.checked)
              this.updateFieldOnState(index, 'required', e.target.checked);
            }} />
          </TableCell>
          <TableCell>
            {field.type && field.type === 'SELECT' && <>
              <TextLink linkType={'secondary'} onClick={ e => {
                this.setState({fields: this.state.fields, modal : {showModal: true, index: index}})
              }}>Options</TextLink>
            </>}
            {field.type && field.type === 'RADIO' && <>Options for radio</>}
            {field.type && field.type === 'CHECKBOX' && <>Options for checkbox</>}
          </TableCell>
        </TableRow>
      })}
      </TableBody>
    </Table>
    <Button onClick={ e => {
      console.log('Button onClick fields', fields);
      this.updateContentField();
    }}>Actualizar</Button>
    </>
    
  }

  render = () => {
    return <>
      {this.renderFormFields()}
      {this.state.fields && this.state.fields.length > 0 && <hr />}
      <Select onChange={ e => {
        console.log('Select onChange e', e.target.value);
        this.setState({
          fields: this.state.fields,
          newTypeField: e.target.value,
          modal: this.state.modal
        });
      }}>
        <Option value=""> Select type </Option>
        <Option value="INPUT_TEXT">INPUT_TEXT</Option>
        <Option value="INPUT_EMAIL">INPUT_EMAIL</Option>
        <Option value="INPUT_NUMBER">INPUT_NUMBER</Option>
        <Option value="CHECKBOX">CHECKBOX</Option>
        <Option value="RADIO">RADIO</Option>
        <Option value="SELECT">SELECT</Option>
        <Option value="TEXTAREA">TEXTAREA</Option>
      </Select>
      <Button onClick={ e => {
        console.log('Button Nuevo field onClick');
        if (this.state.newTypeField) {
          const newField: FGField = {
            type: this.state.newTypeField
          }
          this.setState({
            fields: [...this.state.fields, newField],
            modal: this.state.modal
          });
          console.log('this.state', this.state);
        }
      }}>Nuevo field</Button>

      <hr />
    </>;
  };
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
