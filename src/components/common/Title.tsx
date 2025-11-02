import clsx from "clsx";

interface ITitleProps {
  label: string;
  title: string;
  subTitle: string;
  containerClass?: string;
}

export function Title({ label, title, subTitle, containerClass }: ITitleProps) {
  return (
    <div className={clsx('flex flex-col gap-2 items-center lg:w-[60%]', containerClass)}>
      <div className="bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent w-fit text-lg font-semibold">
        {label}
      </div>
      <div className="font-bold text-2xl leading-9 lg:text-3xl text-center lg:leading-12 w-full">{title}</div>
      <div className="text-secondary text-center text-base">{subTitle}</div>
    </div>
  );
}
