import React from "react";

interface RookIconProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const RookIcon: React.FC<RookIconProps> = ({
  width = 256,
  height = 256,
  className,
  style,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background Rooks */}
      <g opacity="0.5" transform="translate(-50 10) scale(0.9)">
        <rect
          x="95"
          y="60"
          width="90"
          height="140"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="85"
          y="40"
          width="110"
          height="20"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="85"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="109"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="133"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="157"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="181"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
      </g>
      <g opacity="0.5" transform="translate(50 10) scale(0.9)">
        <rect
          x="95"
          y="60"
          width="90"
          height="140"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="85"
          y="40"
          width="110"
          height="20"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="85"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="109"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="133"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="157"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
        <rect
          x="181"
          y="30"
          width="14"
          height="15"
          fill="#A855F7"
          stroke="#333"
          strokeWidth="5"
        />
      </g>

      {/* Dominant Central Rook */}
      <g filter="url(#shadow)" transform="translate(-15 -20)">
        <rect
          x="95"
          y="60"
          width="90"
          height="160"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="85"
          y="40"
          width="110"
          height="20"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="85"
          y="30"
          width="14"
          height="15"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="109"
          y="30"
          width="14"
          height="15"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="133"
          y="30"
          width="14"
          height="15"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="157"
          y="30"
          width="14"
          height="15"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        <rect
          x="181"
          y="30"
          width="14"
          height="15"
          fill="#8B5CF6"
          stroke="#222"
          strokeWidth="6"
        />
        {/* Coffre-fort stylisé parfaitement centré dans la tour principale */}
        <g transform="translate(-71 -40) scale(1.5)">
          <rect
            x="121"
            y="110"
            width="40"
            height="40"
            rx="6"
            fill="#fff"
            stroke="#222"
            strokeWidth="4"
          />
          <circle
            cx="141"
            cy="130"
            r="8"
            fill="#8B5CF6"
            stroke="#222"
            strokeWidth="3"
          />
          <rect
            x="156"
            y="125"
            width="7"
            height="3"
            rx="1.5"
            fill="#8B5CF6"
            stroke="#222"
            strokeWidth="2"
          />
          <circle cx="141" cy="130" r="2" fill="#fff" />
        </g>
      </g>

      <text
        x="128"
        y="245"
        textAnchor="middle"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontSize="32"
        fill="#8B5CF6"
        fontWeight="bold"
        letterSpacing="2"
        style={{ textShadow: "1px 1px 0 #222" }}
      >
        React Rooks
      </text>
    </svg>
  );
};

export default RookIcon;
