import React, { useEffect, useRef, useState } from 'react';

import { widget } from '../../charting_library';
import AppLoader from '../shared/AppLoader';
import { LocalStorageUtil } from '../../utils/localstorage';

const CHART_STATE_LS_KEY = 'KADDEX_TRADINGVIEW_STATE';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);

  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const TVChartContainer = (props) => {
  const { symbol } = props;
  const [isLoading, setIsLoading] = useState(true);

  const tvWidgetRef = useRef(null);

  const ref = useRef();

  const loadingIndicator = <AppLoader className="absolute h-100 w-100 align-ce justify-ce" />;

  useEffect(() => {
    setIsLoading(true);
  }, [symbol]);

  useEffect(() => {
    if (!symbol) {
      return;
    }

    const dateTimeFormat = new Intl.DateTimeFormat();
    const timezone = dateTimeFormat.resolvedOptions().timeZone;

    const enabledFeatures = [];
    let defaultInterval = '60';
    const datefeed_url = new URL("/udf", process.env.REACT_APP_DEXSCAN_API_URL);


    const widgetOptions = {
      theme: 'Dark',
      symbol: symbol,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(datefeed_url),
      interval: defaultInterval,
      container: ref.current,
      library_path: '/static/charting_library/',
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'symbol_search_hot_key',
        'header_undo_redo',
        'header_saveload',
        'control_bar',
        'popup_hints',
      ],
      enabled_features: enabledFeatures,
      client_id: 'tradingview.com',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      custom_css_url: '/css/CustomTradingViewStyle.css',
      overrides: {
        'paneProperties.background': '#1f2034',
        'paneProperties.backgroundType': 'solid',
        timezone: timezone,
      },
      timezone,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
      setIsLoading(false);

      tvWidget.subscribe('drawing_event', function () {
        tvWidget.save(function (state) {
          LocalStorageUtil.set(CHART_STATE_LS_KEY, { [symbol]: state });
        });
      });

      const state = LocalStorageUtil.get(CHART_STATE_LS_KEY);

      // restore the chart to its saved state
      if (state && symbol in state) {
        tvWidget.load(state[symbol]);
      }

      tvWidget.chart().getTimezoneApi().setTimezone(timezone);
    });

    return () => {
      if (tvWidgetRef.current !== null) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, [symbol]);

  if (!symbol) {
    return loadingIndicator;
  }

  return (
    <div className="relative w-100 h-100">
      {isLoading && loadingIndicator}
      <div ref={ref} className="h-100" style={{ borderRadius: '16px', overflow: 'hidden' }} />
    </div>
  );
};

export default TVChartContainer;
