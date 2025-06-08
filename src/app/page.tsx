'use client';

import React, { useState, useRef, useEffect } from "react";
import { Command } from 'cmdk';
import { Terminal } from 'lucide-react';
import ThemeToggle from './_components/ThemeToggle';
import type { Metadata } from 'next';

// Since this is a client component, we'll set the title using useEffect
// For proper SEO, consider making this a server component or using dynamic metadata

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: number;
}

interface Theme {
  bg: string;
  text: string;
  border: string;
  prompt: string;
}

const themes: Record<string, Theme> = {
  dark: {
    bg: 'bg-[#1e1e1e]',
    text: 'text-white',
    border: 'border-gray-700',
    prompt: 'text-white'
  },
  light: {
    bg: 'bg-[#f0f0f0]',
    text: 'text-black',
    border: 'border-gray-300',
    prompt: 'text-black'
  },
  matrix: {
    bg: 'bg-black',
    text: 'text-green-500',
    border: 'border-green-800',
    prompt: 'text-green-500'
  },
  retro: {
    bg: 'bg-black',
    text: 'text-amber-500',
    border: 'border-amber-800',
    prompt: 'text-amber-500'
  },
  blue: {
    bg: 'bg-[#002b36]',
    text: 'text-[#839496]',
    border: 'border-[#073642]',
    prompt: 'text-[#268bd2]'
  }
};

export default function Home() {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentTheme, setCurrentTheme] = useState<string>('dark');
  const bottomRef = useRef<HTMLDivElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');

  // Show welcome message on first load
  useEffect(() => {
    setCommandHistory([{
      command: 'welcome',
      output: (
        <div>
          <p>Welcome to kairaa.dev terminal!</p>
          <p>Type <span className="font-bold">help</span> to see available commands.</p>
        </div>
      ),
      timestamp: Date.now()
    }]);
  }, []);

  // Set page title
  useEffect(() => {
    document.title = "Terminal | Kaira";
  }, []);

  // Auto scroll to bottom when command history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  // Reset history index when input is manually changed
  useEffect(() => {
    if (inputValue !== tempInput) {
      setHistoryIndex(-1);
    }
  }, [inputValue, tempInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      runCommand(inputValue.trim().toLowerCase());
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          const command = commandHistory[commandHistory.length - 1 - newIndex].command;
          setHistoryIndex(newIndex);
          setInputValue(command);
          setTempInput(command);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const command = commandHistory[commandHistory.length - 1 - newIndex].command;
        setHistoryIndex(newIndex);
        setInputValue(command);
        setTempInput(command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
        setTempInput('');
      }
    }
  };

  const outputs = {
    about: (
      <div>
        <p>Hey! I&apos;m Kayra. I write code and sleep in my remaining time.</p>
        <p>I&apos;m a software developer focused on building web applications.</p>
      </div>
    ),
    contact: (
      <div>
        <p>Email: <a href="mailto:kayra@kairaa.dev" className="underline hover:text-blue-400">kayra@kairaa.dev</a></p>
        <p>GitHub: <a href="https://github.com/kairaa" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">@kairaa</a></p>
      </div>
    ),
    links: (
      <div>
        <p>GitHub: <a href="https://github.com/kairaa" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">https://github.com/kairaa</a></p>
      </div>
    ),
    blog: (
      <div>
        <p>Redirecting to blog...</p>
        <p>Visit: <a href="/blog" className="underline hover:text-blue-400">/blog</a></p>
      </div>
    ),
    help: (
      <div>
        <p>Available commands:</p>
        <p>about    - Learn more about me</p>
        <p>contact  - Get my contact information</p>
        <p>links    - View my social links</p>
        <p>blog     - Navigate to blog page</p>
        <p>clear    - Clear the terminal</p>
        <p>theme    - Change terminal theme (dark/light/matrix/retro/blue)</p>
        <p>help     - Show this help message</p>
      </div>
    ),
    theme: (
      <div>
        <p>Available themes:</p>
        <p>dark   - Default dark theme</p>
        <p>light  - Light theme</p>
        <p>matrix - The Matrix theme</p>
        <p>retro  - Retro amber theme</p>
        <p>blue   - Solarized blue theme</p>
        <p>Usage: theme [name]</p>
      </div>
    )
  };

  const runCommand = (command: string) => {
    if (command === 'clear') {
      setCommandHistory([]);
      setInputValue('');
      return;
    }

    // Handle blog command
    if (command === 'blog') {
      // Show the output first
      setCommandHistory(prev => [...prev, {
        command,
        output: outputs.blog,
        timestamp: Date.now()
      }]);
      setInputValue('');
      
      // Navigate to blog after a short delay
      setTimeout(() => {
        window.location.href = '/blog';
      }, 1000);
      return;
    }

    // Handle theme command
    if (command.startsWith('theme ')) {
      const themeName = command.split(' ')[1];
      if (themes[themeName]) {
        setCurrentTheme(themeName);
        setCommandHistory(prev => [...prev, {
          command,
          output: <div>Theme changed to {themeName}</div>,
          timestamp: Date.now()
        }]);
      } else {
        setCommandHistory(prev => [...prev, {
          command,
          output: <div>Theme not found. Type theme to see available themes.</div>,
          timestamp: Date.now()
        }]);
      }
      setInputValue('');
      return;
    }

    const output = outputs[command as keyof typeof outputs] || (
      <div>Command not found. Type help to see available commands.</div>
    );

    setCommandHistory(prev => [...prev, {
      command,
      output,
      timestamp: Date.now()
    }]);
    
    setInputValue('');
  };

  const theme = themes[currentTheme];

  return (
    <div className={`min-h-screen font-mono ${theme.bg} ${theme.text} fixed inset-0 flex flex-col`}>
      <ThemeToggle />
      {/* Command History */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-32 space-y-4">
          {commandHistory.map((entry) => (
            <div key={entry.timestamp}>
              <div className="flex items-center space-x-2">
                <span className={theme.prompt}>$</span>
                <span>{entry.command}</span>
              </div>
              <div className="mt-1 ml-4">
                {entry.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Command Input */}
      <div className={`${theme.bg} border-t ${theme.border}`}>
        <Command className="bg-transparent">
          <div className="flex items-center space-x-2 p-4">
            <span className={theme.prompt}>$</span>
            <Command.Input
              autoFocus
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Type a command or 'help'..."
              className={`flex-1 bg-transparent border-none outline-none ${theme.text} placeholder-gray-500`}
              onKeyDown={handleKeyDown}
            />
          </div>
        </Command>
      </div>
    </div>
  );
}
