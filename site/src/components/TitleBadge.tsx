export function TitleBadge({ children }: React.PropsWithChildren) {
  return (
    <h2 className="rounded-sm bg-gray-200 text-gray-600 p-1 px-2 m-2 text-xs w-fit font-bold shadow-sm">
      {children}
    </h2>
  );
}
