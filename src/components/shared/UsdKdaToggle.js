import Toggle from './BigToggle';
import Label from './Label';
import {KadenaSimpleLogo} from '../../assets';

/* <Row style={{ marginTop: 8 }}> */

const UsdKdaToggle = ({initialState, onClick}) =>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <Label fontSize={28} labelStyle={{ marginRight: 8, marginTop:-3}}>$</Label>
    <Toggle initialState={initialState} onClick={onClick} />
    <KadenaSimpleLogo style={{width:28, height:28, marginLeft:"5px"}} />
  </div>

export default UsdKdaToggle
