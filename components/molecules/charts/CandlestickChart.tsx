'use client';

import React, { useEffect } from 'react';
import { ChartData } from '@/lib/types';

interface CandlestickChartProps {
  data: ChartData[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  minValue: number;
  maxValue: number;
  padding: number;
  upColor: string;
  downColor: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  containerRef,
  minValue,
  maxValue,
  padding,
  upColor,
  downColor,
}) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      // 기존 캔들스틱 요소 제거
      const existingGroup = svgElement.querySelector('g.candlestick-overlay');
      if (existingGroup) {
        existingGroup.remove();
      }

      // SVG 크기 가져오기
      const svgRect = svgElement.getBoundingClientRect();
      const width = svgRect.width;
      const height = svgRect.height;

      if (width <= 0 || height <= 0) return;

      // 차트 영역 계산 (마진 고려)
      const chartLeft = 80; // Y축 라벨 공간
      const chartRight = width - 50; // 오른쪽 마진
      const chartTop = 20; // 상단 마진
      const chartBottom = height - 30; // 하단 마진
      const chartWidth = chartRight - chartLeft;
      const chartHeight = chartBottom - chartTop;

      // 클리핑 경로 생성
      let clipPath = svgElement.querySelector('#chart-clip');
      if (!clipPath) {
        const defs = svgElement.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', 'chart-clip');
        const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipRect.setAttribute('x', String(chartLeft));
        clipRect.setAttribute('y', String(chartTop));
        clipRect.setAttribute('width', String(chartWidth));
        clipRect.setAttribute('height', String(chartHeight));
        clipPath.appendChild(clipRect);
        if (!svgElement.querySelector('defs')) {
          svgElement.insertBefore(defs, svgElement.firstChild);
        }
        defs.appendChild(clipPath);
      }

      // 새로운 그룹 생성
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'candlestick-overlay');
      group.setAttribute('clip-path', 'url(#chart-clip)');

      const barWidth = chartWidth / data.length;
      const scale = chartHeight / (maxValue - minValue + padding * 2);
      const offsetY = chartTop;

      data.forEach((entry: any, index: number) => {
        if (
          typeof entry.open !== 'number' ||
          typeof entry.close !== 'number' ||
          typeof entry.high !== 'number' ||
          typeof entry.low !== 'number'
        ) {
          return;
        }

        const isUp = entry.close >= entry.open;
        const color = isUp ? upColor : downColor;

        // X 좌표 계산 (차트 영역 내에서만)
        const x = chartLeft + index * barWidth + barWidth / 2;

        // Y 좌표 계산 (차트 영역 내에서만)
        const highY = offsetY + (maxValue + padding - entry.high) * scale;
        const lowY = offsetY + (maxValue + padding - entry.low) * scale;
        const openY = offsetY + (maxValue + padding - entry.open) * scale;
        const closeY = offsetY + (maxValue + padding - entry.close) * scale;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

        const candleWidth = Math.max(barWidth * 0.6, 2);

        // 심지 (고가-저가 선)
        const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        wick.setAttribute('x1', String(x));
        wick.setAttribute('y1', String(highY));
        wick.setAttribute('x2', String(x));
        wick.setAttribute('y2', String(lowY));
        wick.setAttribute('stroke', color);
        wick.setAttribute('stroke-width', '1.5');
        group.appendChild(wick);

        // 몸통 (시가-종가)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        body.setAttribute('x', String(x - candleWidth / 2));
        body.setAttribute('y', String(bodyTop));
        body.setAttribute('width', String(candleWidth));
        body.setAttribute('height', String(bodyHeight));
        body.setAttribute('fill', isUp ? upColor : downColor);
        body.setAttribute('stroke', color);
        body.setAttribute('stroke-width', '1');
        group.appendChild(body);
      });

      svgElement.appendChild(group);
    }, 200);

    return () => clearTimeout(timer);
  }, [data, containerRef, minValue, maxValue, padding, upColor, downColor]);

  return null;
};

