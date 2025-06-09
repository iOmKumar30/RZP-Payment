import { useEffect } from "react";
import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { useContext } from "react";

function useBackButtonWarning(when = true, message = "Are you sure you want to leave this page?") {
  const navigator = useContext(UNSAFE_NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const replace = navigator.replace;

    const blocker = (tx) => {
      const confirm = window.confirm(message);
      if (confirm) tx.retry();
    };

    const unblock = navigator.block((tx) => {
      if (tx.location.pathname !== window.location.pathname) {
        blocker(tx);
      }
    });

    return unblock;
  }, [message, when]);
}
export default useBackButtonWarning;
