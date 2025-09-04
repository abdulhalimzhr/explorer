export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      this.metrics.get(label)!.push(duration);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }
    };
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } | null {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return null;

    return {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  }

  getAllMetrics(): Record<string, ReturnType<typeof this.getMetrics>> {
    const result: Record<string, ReturnType<typeof this.getMetrics>> = {};
    
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label);
    }
    
    return result;
  }

  clear(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Composable for Vue components
export const usePerformanceMonitor = () => {
  const monitor = performanceMonitor;

  const measureAsync = async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const stopTimer = monitor.startTimer(label);
    try {
      const result = await fn();
      return result;
    } finally {
      stopTimer();
    }
  };

  const measureSync = <T>(label: string, fn: () => T): T => {
    const stopTimer = monitor.startTimer(label);
    try {
      return fn();
    } finally {
      stopTimer();
    }
  };

  return {
    measureAsync,
    measureSync,
    getMetrics: monitor.getMetrics.bind(monitor),
    getAllMetrics: monitor.getAllMetrics.bind(monitor),
    clear: monitor.clear.bind(monitor)
  };
};