import { Button } from "@/components/ui/button";
import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const healthCheck = useQuery(trpc.index.queryOptions());

  return (
    <div className="w-screen">
      <div className="justify-between flex items-center">
        <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <div>
          <Link to="/auth">
            <Button className="m-2">Sign In</Button>
          </Link>
        </div>
      </div>
      <hr />
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button>{`Check Health: ${healthCheck.data}`}</button>
      <Outlet />
    </div>
  );
}
