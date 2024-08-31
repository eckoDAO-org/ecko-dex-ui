import {KadenaSimpleLogo} from '../../assets';
import Label from '../../components/shared/Label';
import { humanReadableNumber } from '../../utils/reduceBalance';


const UsdKdaPrice = ({value, unit, precision=2, fontSize=14}) => {
  const _unit = unit === "KDA"?<KadenaSimpleLogo style={{width:fontSize, height:fontSize, marginRight:"5px"}} />:unit;

  const _value = humanReadableNumber(value, 3) !== '0.000' ? humanReadableNumber(value, 3) : value.toFixed(precision);

  return  <Label fontSize={fontSize}>{_unit} {_value}</Label>
  }

export default UsdKdaPrice;
