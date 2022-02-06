export default function Logo({ color, size }) {
    if (size == "small"){
        const width = "200"
        const height = "200"
        const viewBox = "0 0 200 200"
    }
    return (
        <div>
            <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="241.5" y1="334.5" x2="470.5" y2="334.5" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="276.5" y1="299.5" x2="435.5" y2="299.5" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="276.5" y1="369.5" x2="435.5" y2="369.5" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="67.0676" y2="-7.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 148.229 234.802)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="90.0959" y2="-7.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 178.469 171.994)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="67.0676" y2="-7.5" transform="matrix(0.707107 0.707107 0.707107 -0.707107 240.501 140.978)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="354.968" y1="79.9031" x2="79.9032" y2="354.968" stroke={color} stroke-width="20" stroke-linecap="round"/>
            <line x1="148.229" y1="426.574" x2="190.349" y2="384.453" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="178.469" y1="489.381" x2="236.873" y2="430.977" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="240.501" y1="520.397" x2="282.622" y2="478.277" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="10" y1="-10" x2="399" y2="-10" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 354.968 606.221)" stroke={color} stroke-width="20" stroke-linecap="round"/>
            <line x1="562.753" y1="246.408" x2="520.633" y2="288.529" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="532.513" y1="183.601" x2="474.109" y2="242.005" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="470.48" y1="152.585" x2="428.36" y2="194.705" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="10" y1="-10" x2="399" y2="-10" transform="matrix(0.707107 0.707107 0.707107 -0.707107 356.014 66.761)" stroke={color} stroke-width="20" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="67.0676" y2="-7.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 562.753 436.18)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="90.0959" y2="-7.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 532.513 498.988)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="7.5" y1="-7.5" x2="67.0676" y2="-7.5" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 470.48 530.004)" stroke={color} stroke-width="15" stroke-linecap="round"/>
            <line x1="356.014" y1="591.079" x2="631.079" y2="316.015" stroke={color} stroke-width="20" stroke-linecap="round"/>
            </svg>
        </div>
    )
}