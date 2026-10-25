"use client";

import { useState } from "react";
import { Check, Clipboard, FileText, Info, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const snippet = '<iframe src="https://embedmynotion.example/product-handbook" width="100%" height="640"></iframe>';

export function EmbedDemo() {
  const [theme, setTheme] = useState("light");
  const [border, setBorder] = useState(true);
  const [radius, setRadius] = useState(14);
  const [padding, setPadding] = useState(28);
  const [width, setWidth] = useState("wide");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="demo-shell" id="demo">
      <div className="demo-topbar">
        <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span className="demo-breadcrumb">Embeds <span>/</span> Product handbook</span>
        <span className="saved-status"><i /> Saved</span>
      </div>
      <div className="demo-grid">
        <aside className="settings-panel" aria-label="Embed settings">
          <div className="settings-heading">
            <div><span className="mini-label">EMBED SETTINGS</span><h3>Make it yours</h3></div>
            <Tooltip>
              <TooltipTrigger render={<button className="icon-button" aria-label="About embed settings" />}><Info /></TooltipTrigger>
              <TooltipContent>Changes update the preview instantly.</TooltipContent>
            </Tooltip>
          </div>

          <label className="field-group">
            <span className="field-label">Notion page URL</span>
            <Input value="notion.so/Product-Handbook" readOnly aria-label="Notion page URL" />
          </label>

          <div className="field-group">
            <span className="field-label">Appearance</span>
            <Tabs value={theme} onValueChange={(value) => setTheme(String(value))}>
              <TabsList className="theme-tabs">
                <TabsTrigger value="light"><Sun /> Light</TabsTrigger>
                <TabsTrigger value="dark"><Moon /> Dark</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="width-select">Preview width</label>
            <Select value={width} onValueChange={(value) => setWidth(String(value))}>
              <SelectTrigger id="width-select" className="select-trigger"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="full">Full width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="range-group">
            <div><span className="field-label">Corner radius</span><output>{radius}px</output></div>
            <Slider value={[radius]} onValueChange={(value) => setRadius(Number(value))} min={0} max={24} step={1} aria-label="Corner radius" />
          </div>
          <div className="range-group">
            <div><span className="field-label">Page padding</span><output>{padding}px</output></div>
            <Slider value={[padding]} onValueChange={(value) => setPadding(Number(value))} min={16} max={44} step={2} aria-label="Page padding" />
          </div>

          <div className="switch-row">
            <div><span className="field-label">Frame border</span><small>Add a subtle edge</small></div>
            <Switch checked={border} onCheckedChange={setBorder} aria-label="Toggle frame border" />
          </div>

          <Button className="copy-button" onClick={copyCode}>
            {copied ? <Check /> : <Clipboard />} {copied ? "Copied to clipboard" : "Copy embed code"}
          </Button>
        </aside>

        <section className={`preview-stage ${theme === "dark" ? "is-dark" : ""}`} aria-label="Live embed preview">
          <div className="preview-meta">
            <span><i /> Interactive preview</span>
            <span className="device-label">Desktop</span>
          </div>
          <div className={`preview-wrap width-${width}`}>
            <article className={`notion-page ${border ? "has-border" : ""}`} style={{ borderRadius: `${radius}px`, padding: `${padding}px` }}>
              <div className="document-meta"><FileText /> COMPANY WIKI</div>
              <div className="page-icon">📘</div>
              <h3>Product Handbook</h3>
              <p className="document-lead">Everything our team needs to build, launch, and support a product people love.</p>
              <hr />
              <h4>How we work</h4>
              <div className="check-list">
                <p><span className="checked"><Check /></span> Start with the customer problem</p>
                <p><span className="checked"><Check /></span> Share work early and often</p>
                <p><span className="unchecked" /> Measure what matters</p>
              </div>
              <div className="callout"><span>💡</span><p><strong>Good to know</strong><br />This handbook is a living document. Suggest improvements anytime.</p></div>
              <div className="mini-table" role="table" aria-label="Team contacts">
                <div role="row"><span role="columnheader">Area</span><span role="columnheader">Owner</span><span role="columnheader">Status</span></div>
                <div role="row"><span role="cell">Product</span><span role="cell">Maya</span><span role="cell"><i /> Active</span></div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
