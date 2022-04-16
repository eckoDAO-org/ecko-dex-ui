import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useApplicationContext } from '../../contexts';
import { theme } from '../../styles/theme';
import percentageDark from '../../assets/images/shared/percentage-dark.svg';
import percentageLight from '../../assets/images/shared/percentage-light.svg';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  input[type='range'] {
    -webkit-appearance: none;
    background-color: transparent;
    height: 16px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${({ theme: { colors } }) => `${colors.white}99`};
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${({ theme: { colors } }) => colors.white};
    border: 1px solid ${({ theme: { backgroundContainer } }) => backgroundContainer};
    border-radius: 50%;
    height: 24px;
    width: 24px;
    cursor: grab;
    background-image: ${({ themeMode }) => `url(${themeMode === 'light' ? percentageLight : percentageDark})`};
    background-repeat: no-repeat;
    background-position: center;
  }

  input[type='range']::-moz-range-thumb {
    background-color: ${({ theme: { backgroundContainer } }) => backgroundContainer};
    border: 1px solid ${({ theme: { colors } }) => `${colors.white}99`};
    border-radius: 50%;
    border: none;
    height: 24px;
    width: 24px;
  }
  .percentage {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    text-align: center;
    line-height: 1;

    transform: translate(0, 2px);
  }
`;

const InputRange = ({ value, setValue }) => {
  const { themeMode } = useApplicationContext();
  useEffect(() => {
    document.querySelectorAll('.__range').forEach(function (el) {
      el.oninput = function () {
        var valPercent = value ? (el.valueAsNumber - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min)) : 0;
        var style = `background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${valPercent}, ${
          theme(themeMode).colors.white
        }), color-stop(${valPercent},transparent));`;

        el.style = style;
        // el.innerHTML = <Label color="red">%</Label>;
      };
      el.oninput();
    });
  }, [themeMode, value]);

  return (
    <Wrapper themeMode={themeMode}>
      <input
        className="__range"
        style={{ width: '100%', marginBottom: 16 }}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => {
          setValue(event.target.valueAsNumber);
        }}
      />
    </Wrapper>
  );
};

export default InputRange;
