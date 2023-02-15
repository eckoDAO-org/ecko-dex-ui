import React, { useState } from 'react';
import { Modal, Header, Icon } from 'semantic-ui-react';
import ModalContainer from '../shared/ModalContainer';
import CustomButton from '../shared/CustomButton';

import Input from '../shared/Input';
import InputToken from '../shared/InputToken';
import MenuTabs from '../shared/MenuTabs';
import cryptoCurrencies from '../constants/tokens';

import { ROUTE_INDEX } from '../router/routes';
import { NavLink } from 'react-router-dom';
import TokenSelectorModal from '../components/swap/swap-modals/TokenSelectorModal';

const WrapContainer = (props) => {
  const [activeItem, setActiveItem] = useState(0);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [amountReceived, setAmountReceived] = useState('');

  const onTokenClick = ({ crypto }) => {
    setSelectedToken(crypto.code);
  };

  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Modal
        basic
        onClose={() => {
          props.history.goBack();
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Header icon>
          <Icon name='time' />
          Coming soon!
        </Header>
        <Modal.Content>
          The bridge feature is coming to eckoDEX soon! Be ready to wrap and
          unwrap your tokens
        </Modal.Content>
        <Modal.Actions>
          <CustomButton>
            <NavLink to={ROUTE_INDEX} style={{ color: 'white' }}>
              <Icon name='checkmark' /> Got it
            </NavLink>
          </CustomButton>
        </Modal.Actions>
      </Modal>

      <TokenSelectorModal
        show={showTokenSelector}
        selectedToken={selectedToken}
        onTokenClick={onTokenClick}
        onClose={() => setShowTokenSelector(false)}
      />
      <ModalContainer>
        <MenuTabs
          activeItem={activeItem}
          items={['wrap', 'unwrap']}
          onItemClick={(index) => setActiveItem(index)}
        />
        <Input
          leftLabel='input'
          placeholder='enter amount'
          inputRightComponent={
            selectedToken ? (
              <InputToken
                icon={cryptoCurrencies[selectedToken].icon}
                code={cryptoCurrencies[selectedToken].code}
                onClick={() => setShowTokenSelector(true)}
              />
            ) : null
          }
          containerStyle={{ marginBottom: 16 }}
          withSelectButton
          numberOnly
          value={amount}
          onSelectButtonClick={() => setShowTokenSelector(true)}
          onChange={(e, { value }) => setAmount(value)}
        />
        <Input
          leftLabel='destination'
          placeholder='enter address'
          containerStyle={{ marginBottom: 16 }}
          value={address}
          onChange={(e, { value }) => setAddress(value)}
        />
        <Input
          leftLabel='you will receive'
          placeholder='amount'
          value={amountReceived}
          disabled
          onChange={(e, { value }) => setAmountReceived(value)}
        />
        <CustomButton
          buttonStyle={{ marginTop: 24 }}
          onClick={() => console.log('next')}
        >
          Next
        </CustomButton>
      </ModalContainer>
    </>
  );
};

export default WrapContainer;
