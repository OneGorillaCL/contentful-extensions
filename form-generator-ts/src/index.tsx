import * as React from 'react';
import { render } from 'react-dom';
import { TextInput, Select, Option, Button } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  fields: Array<FGField>;
  newTypeField?: FGFieldType
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

interface FGField {
  id? : string;
  name? : string;
  extraClassCss? : string;
  placeHolder? : string;
  type : FGFieldType
}

interface FormGenerator {
  fields: Array<FGField>
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    console.log( 'props.sdk.field.getValue', ( (props.sdk.field.getValue() ) ? true : false ) );
    this.state = {
      fields: ( ( props.sdk.field.getValue() ) ? JSON.parse( props.sdk.field.getValue() ) : [] )
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

  /*onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.currentTarget.value);
    this.setState({ value });
    if (value) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };*/

  renderFormFields = () => {
    const { fields } = this.state;
    console.log('renderFormFields');
    return fields && fields.length > 0 && <>
    <table>
      <tbody>
      <tr>
        <th>
          Type
        </th>
        <th>
          ID
        </th>
        <th>
          extraClassCss
        </th>
      </tr>
      {fields.map( (field: FGField) => {
        return <tr>
          <td>
            {field.type || ''}
          </td>
          <td>
            {field.id || ''}
          </td>
          <td>
            {field.extraClassCss || ''}
          </td>
        </tr>
      })}
      </tbody>
    </table>
    <Button onClick={ e => {
      console.log('Button onClick e', e);
    }}>Actualizar</Button>
    </>
    
  }

  render = () => {
    return <>
      {this.renderFormFields()}
      <hr />
      <Select onChange={ e => {
        console.log('Select onChange e', e.target.value);
        this.setState({
          fields: this.state.fields,
          newTypeField: e.target.value
        });
      }}>
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
            fields: [...this.state.fields, newField]
          });
          console.log('this.state', this.state);
        }
      }}>Nuevo field</Button>
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
