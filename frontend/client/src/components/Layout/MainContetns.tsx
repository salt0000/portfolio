export type ContentProps = {
  children: React.ReactNode;
};

export const MainContetns = (props: ContentProps) => {
  const { children } = props;

  return (
    <main className='flex-1'>
      <div className='px-6 py-10'>{children}</div>
    </main>
  );
};
