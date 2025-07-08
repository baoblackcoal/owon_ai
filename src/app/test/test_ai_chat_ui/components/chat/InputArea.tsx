import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const instruments = [
  { label: "示波器", value: "oscilloscope" },
  { label: "ADS800A", value: "ads800a" },
  { label: "ADS900A", value: "ads900a" },
  { label: "ADS3000", value: "ads3000" },
  { label: "ADS3000A", value: "ads3000a" },
  { label: "ADS4000", value: "ads4000" },
  { label: "ADS4000A", value: "ads4000a" },
];

interface InputAreaProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput(''); // 发送后清空输入框
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4" id="ai_chat_input_area">
      <style jsx global>{`
        *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-row space-x-4 mb-4" id="ai_chat_input_common">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none"
              >
                {selectedInstrument
                  ? instruments.find((instrument) => instrument.value === selectedInstrument)?.label
                  : "选择仪器系列..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border-none shadow-md">
              <Command>
                <CommandInput placeholder="搜索仪器系列..." />
                <CommandEmpty>未找到相关仪器</CommandEmpty>
                <CommandGroup>
                  {instruments.map((instrument) => (
                    <CommandItem
                      key={instrument.value}
                      value={instrument.value}
                      onSelect={(currentValue) => {
                        setSelectedInstrument(currentValue === selectedInstrument ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedInstrument === instrument.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {instrument.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="继续在此对话中提问..."
            className="pr-12 resize-none min-h-[100px] max-h-[200px]"
            disabled={disabled}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2"
            onClick={handleSend}
            disabled={!input.trim() || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center" id="ai_chat_ui_input_area_tip">
          AI回答未必准确，请核查
        </div>
      </div>
    </div>
  );
} 