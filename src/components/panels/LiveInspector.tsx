"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code2, Layers, Activity, Info, Palette, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';

interface LiveInspectorProps {
  result: GenerateSvgMotionFromPromptOutput | null;
  className?: string;
}

export const LiveInspector: React.FC<LiveInspectorProps> = ({ result, className }) => {
  return (
    <div className={cn("glass border-l border-white/10 flex flex-col h-full", className)}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xs font-headline font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Elite Kinetic Inspector
        </h2>
      </div>

      <Tabs defaultValue="svg" className="flex-1 flex flex-col">
        <div className="px-2 pt-2">
          <TabsList className="w-full bg-black/40 border border-white/5 h-9 overflow-x-auto no-scrollbar">
            <TabsTrigger value="svg" className="flex-1 text-[9px] gap-1.5 uppercase font-code">
              <Layers className="w-3 h-3" />
              SVG
            </TabsTrigger>
            <TabsTrigger value="css" className="flex-1 text-[9px] gap-1.5 uppercase font-code">
              <Palette className="w-3 h-3" />
              CSS
            </TabsTrigger>
            <TabsTrigger value="gsap" className="flex-1 text-[9px] gap-1.5 uppercase font-code">
              <Code2 className="w-3 h-3" />
              GSAP
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex-1 text-[9px] gap-1.5 uppercase font-code">
              <Info className="w-3 h-3" />
              Meta
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="svg" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4">
              <pre className="text-[10px] font-code text-accent leading-relaxed whitespace-pre-wrap">
                {result ? formatXml(result.svg) : '// No vector data'}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4">
              <pre className="text-[10px] font-code text-emerald-400 leading-relaxed whitespace-pre-wrap">
                {result?.css || '/* No CSS animations */'}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="gsap" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4">
              <pre className="text-[10px] font-code text-primary leading-relaxed whitespace-pre-wrap">
                {result?.gsap || '// No GSAP choreography'}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="meta" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-6 space-y-6">
              {result && (
                <>
                  <MetaItem label="Title" value={result.title} />
                  <MetaItem label="Description" value={result.description} />
                  <MetaItem label="Color Palette" value={result.colorPalette.join(', ')} />
                  <MetaItem label="Semantic Layers" value={result.layers.join(', ')} />
                  <MetaItem label="Morph Targets" value={result.morphTargets.join(', ')} />
                  <MetaItem label="Animations" value={result.animations.join(', ')} />
                </>
              )}
              {!result && <p className="text-sm text-muted-foreground italic">No metadata available</p>}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-[9px] font-code text-muted-foreground uppercase tracking-widest">{label}</h3>
      <p className="text-[11px] text-foreground/80 leading-relaxed font-body">
        {value}
      </p>
    </div>
  );
}

function formatXml(xml: string) {
  let formatted = '';
  let indent = '';
  xml.split(/>\s*</).forEach(function(node) {
    if (node.match( /^\/\w/ )) indent = indent.substring(2);
    formatted += indent + '<' + node + '>\r\n';
    if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += '  ';
  });
  return formatted.substring(1, formatted.length-3);
}
