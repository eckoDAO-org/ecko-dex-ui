import React, { useContext } from "react";
import styled from "styled-components/macro";
import { Transition } from "react-spring/renderprops";
import Backdrop from "../../shared/Backdrop";
import ModalContainer from "../../shared/ModalContainer";
import { AccountContext } from "../../contexts/AccountContext";

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  z-index: 5;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 24px;
`;

const LayoutModal = ({
  title,
  description,
  open,
  onClose,
  containerStyle,
  children,
  content,
}) => {
  const { account } = useContext(AccountContext);
  return (
    <>
      <Transition
        items={open}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {(open) =>
          open &&
          ((props) => (
            <Container style={props}>
              <Backdrop
                onClose={() => {
                  onClose();
                }}
              />
              <ModalContainer
                title={title}
                description={description}
                containerStyle={{
                  height: "100%",
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                  ...containerStyle,
                }}
                onClose={() => {
                  onClose();
                }}
              >
                {!account?.account && (
                  <ContentContainer> {content || children}</ContentContainer>
                )}
              </ModalContainer>
            </Container>
          ))
        }
      </Transition>
    </>
  );
};

export default LayoutModal;
