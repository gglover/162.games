export function TitleBadge({ children }: React.PropsWithChildren) {
  return (
    <h2 className="rounded-md bg-gray-100 text-gray-500 p-1 px-2 m-2 text-xs w-fit font-bold shadow-sm">
      {children}
    </h2>
  );
}
