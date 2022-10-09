import { useRouter } from 'next/router';
import { useEffect } from 'react';

// https://medium.com/@mikegajdos81/how-to-add-googleanalytics-4-to-nextjs-app-in-4-simple-steps-3c6f9de2f866
const NEXT_PUBLIC_G_TAG_ID = process.env.NEXT_PUBLIC_G_TAG_ID;
if (!NEXT_PUBLIC_G_TAG_ID) {
  throw new Error('Missing NEXT_PUBLIC_G_TAG_ID ');
}

class GTag {
  public logPageView = (url: string) =>
    this.config({
      page_path: url,
    });

  public setUser = (uuid: string | void) => this.config({ user_id: uuid });

  public useGtag = () => {
    const router = useRouter();
    useEffect(() => {
      const handleRouteChange = (url: string) => {
        if (process.env.NODE_ENV !== 'production') {
          return;
        }
        this.logPageView(url);
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]);
  };

  private readonly config = (settings: ConfigSettings) => {
    (window as any).gtag('config', NEXT_PUBLIC_G_TAG_ID, settings);
  };
}

type ConfigSettings =
  | {
      page_path: string;
    }
  | { user_id: string | void };

export const gtag = new GTag();
