export interface ColorMatch {
    color: string;
    range: [number, number];
    type: 'hex' | 'rgb' | 'hsl' | 'css-var';
    value: string;
}

export class ColorDetector {
    private readonly patterns = {
        hex: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
        rgb: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g,
        rgba: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)/g,
        hsl: /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)/g,
        hsla: /hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*,\s*(0|1|0?\.\d+)\s*\)/g,
        cssVar: /var\(--[a-zA-Z][a-zA-Z0-9-]*\)/g
    };

    public findColors(text: string): ColorMatch[] {
        const matches: ColorMatch[] = [];
        

        this.findPatternMatches(text, this.patterns.hex, 'hex', matches);
        

        this.findPatternMatches(text, this.patterns.rgb, 'rgb', matches);
        this.findPatternMatches(text, this.patterns.rgba, 'rgb', matches);
        

        this.findPatternMatches(text, this.patterns.hsl, 'hsl', matches);
        this.findPatternMatches(text, this.patterns.hsla, 'hsl', matches);
        

        this.findPatternMatches(text, this.patterns.cssVar, 'css-var', matches);
        
        return matches;
    }

    private findPatternMatches(
        text: string,
        pattern: RegExp,
        type: ColorMatch['type'],
        matches: ColorMatch[]
    ) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            matches.push({
                color: match[0],
                range: [match.index, match.index + match[0].length],
                type,
                value: match[0]
            });
        }
    }

    public isValidHex(hex: string): boolean {
        return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
    }

    public hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}
