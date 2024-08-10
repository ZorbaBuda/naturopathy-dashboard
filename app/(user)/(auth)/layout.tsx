

export default function UserAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center bg-custom-gray2 dark:bg-black">
      
      <div className="lg:flex-1 flex justify-center items-center px-3 lg:px-0 my-32 lg:my-0">
        {children}
      </div>
    </div>
  );
}
