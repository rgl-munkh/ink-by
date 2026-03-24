import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const Container = ({ children, containerClassName, className }: ContainerPropsType) => {
  return (
    <div className={cn('mt-5 flex w-full flex-col items-center', containerClassName)}>
      <div className={cn('flex w-full max-w-[976px] flex-col items-center max-lg:px-2 lg:px-8', className)}>
        {children}
      </div>
    </div>
  );
};
type ContainerPropsType = {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
};
