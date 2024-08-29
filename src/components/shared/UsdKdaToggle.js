import Toggle from '../liquidity/Toggle';
import Label from './Label';

/* <Row style={{ marginTop: 8 }}> */

const UsdKdaToggle = ({initialState, onClick}) =>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <Label labelStyle={{ marginRight: 8, marginTop: 8 }}>USD</Label>
    <Toggle initialState={initialState} onClick={onClick} />
    <Label labelStyle={{ marginLeft: 8, marginTop: 8 }}>KDA</Label>
  </div>

export default UsdKdaToggle
