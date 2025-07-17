import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../../hooks/useCounter';

describe('useCounter hook', () => {
  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(4);
  });

  it('should reset count to initial value', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });
    expect(result.current.count).toBe(0);
  });
});