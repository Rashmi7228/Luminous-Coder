import { useSpeech } from "@/hooks/use-speech";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDB } from "@/hooks/use-db";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

interface MicButtonProps {
  onResult: (text: string) => void;
  className?: string;
}

export function MicButton({ onResult, className }: MicButtonProps) {
  const { settings } = useDB();
  const { isSupported, isListening, listen, stopListening } = useSpeech(settings?.language);

  useEffect(() => {
    if (!isSupported) {
      const shown = localStorage.getItem('voice_not_supported_shown');
      if (!shown) {
        toast.info("Voice input is not supported on this browser.");
        localStorage.setItem('voice_not_supported_shown', 'true');
      }
    }
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "transition-all shrink-0",
            isListening && "bg-primary/20 text-primary border-primary/50 animate-pulse",
            className
          )}
          onClick={() => {
            if (isListening) {
              stopListening();
            } else {
              listen(
                (text) => {
                  onResult(text);
                  toast.success("Voice recorded");
                },
                () => toast.error("Could not hear anything. Try again.")
              );
            }
          }}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isListening ? "Stop listening" : "Tap to speak"}
      </TooltipContent>
    </Tooltip>
  );
}
