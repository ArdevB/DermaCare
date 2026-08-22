"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { checkKhaltiStatus } from "@/lib/shopActions";
import { getErrorMessage } from "@/lib/api";

// Khalti redirects the customer's browser here after they complete or cancel
// payment (this is the `return_url` the backend sends when initiating
// payment). We verify status with our own backend rather than trusting the
// URL alone, since query params can be tampered with.
function PaymentCallbackInner({ id }) {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pidx) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setMessage("Missing payment reference from Khalti.");
      return;
    }
    let cancelled = false;
    checkKhaltiStatus(pidx)
      .then((res) => {
        if (cancelled) return;
        const paymentStatus = res.data.order?.payment?.status;
        if (paymentStatus === "paid") {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage("Payment was not completed.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(getErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [pidx]);

  return (
    <main className="container mx-auto px-6 py-20 text-center">
      {status === "checking" && (
        <>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-pink-500" />
          <p className="mt-4 text-gray-500">
            Confirming your payment with Khalti...
          </p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Payment successful
          </h1>
          <Link
            href={`/orders/${id}`}
            className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
          >
            View order
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Payment not completed
          </h1>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
          <Link
            href={`/orders/${id}`}
            className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
          >
            Go to order &amp; retry
          </Link>
        </>
      )}
    </main>
  );
}

export default function PaymentCallbackPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense fallback={null}>
      <PaymentCallbackInner id={id} />
    </Suspense>
  );
}
