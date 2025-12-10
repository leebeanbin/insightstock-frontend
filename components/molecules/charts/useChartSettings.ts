import { useState, useEffect } from 'react';
import { CrosshairMode } from 'lightweight-charts';

export interface ChartSettings {
  showGrid: boolean;
  showVolume: boolean;
  showCrosshair: boolean;
}

export function useChartSettings(chartRef: React.RefObject<any>, isDark: boolean) {
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    showGrid: true,
    showVolume: true,
    showCrosshair: true,
  });

  // 그리드 및 크로스헤어 설정 업데이트
  useEffect(() => {
    if (!chartRef.current) return;
    
    // 차트가 초기화될 때까지 대기
    const timeoutId = setTimeout(() => {
      try {
        // 차트가 dispose되었는지 확인
        const chart = chartRef.current;
        if (!chart || typeof chart.applyOptions !== 'function') return;
        
        // 차트가 유효한지 확인 (내부 속성 체크)
        if (!chart.timeScale || typeof chart.timeScale !== 'function') return;
        
        chart.applyOptions({
          grid: {
            vertLines: { 
              visible: chartSettings.showGrid,
              color: isDark ? '#374151' : '#f0f0f0',
            },
            horzLines: { 
              visible: chartSettings.showGrid,
              color: isDark ? '#374151' : '#f0f0f0',
            },
          },
          crosshair: {
            mode: chartSettings.showCrosshair ? CrosshairMode.Normal : CrosshairMode.Hidden,
            vertLine: {
              labelVisible: chartSettings.showCrosshair,
            },
            horzLine: {
              labelVisible: chartSettings.showCrosshair,
            },
          },
        });
      } catch (error) {
        // dispose된 경우 무시
        if (error instanceof Error && error.message.includes('disposed')) {
          return;
        }
        console.error('Chart settings update error:', error);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [chartSettings, isDark, chartRef]);

  return { chartSettings, setChartSettings };
}

