import { Spinner } from "@/components/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Spinner size="xl" variant="default" />
    </div>
  );
}

export default LoadingSpinner