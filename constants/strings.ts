type Lang = 'bn' | 'en';

export const getStrings = (lang: Lang) => ({
  home: {
    searchPlaceholder: lang === 'bn' ? 'আপনি কোথায় যাবেন?' : 'Where do you want to go?',
    whereTo:           lang === 'bn' ? 'কোথায় যাবেন?' : 'Where to?',
    nearbyDrivers:     (n: number) =>
      lang === 'bn' ? `${n}টি রিকশা কাছে আছে` : `${n} rickshaws nearby`,
    noDrivers:         lang === 'bn' ? 'কাছে কোনো রিকশা নেই' : 'No rickshaws nearby',
  },
  booking: {
    instant:   lang === 'bn' ? 'সরাসরি যাত্রা' : 'Instant Ride',
    hourly:    lang === 'bn' ? 'ঘণ্টায় ভাড়া'  : 'By Hour',
    schedule:  lang === 'bn' ? 'আগাম বুকিং'   : 'Schedule',
    book:      lang === 'bn' ? 'রিকশা বুক করুন' : 'Book Rickshaw',
    surgeNote: (x: number) =>
      lang === 'bn' ? `পিক আওয়ার — ভাড়া ${x}x` : `Peak hour — fare ${x}x`,
  },
  errors: {
    network:   lang === 'bn' ? 'ইন্টারনেট নেই। আবার চেষ্টা করুন।' : 'No internet. Please retry.',
    server:    lang === 'bn' ? 'সার্ভারে সমস্যা হচ্ছে।'            : 'Server error. Try later.',
    noMatch:   lang === 'bn' ? 'কাছে কোনো রিকশা নেই।'             : 'No rickshaws found nearby.',
    gps:       lang === 'bn' ? 'অবস্থান অনুমতি দিন।'              : 'Allow location access.',
  },
  safeRide: {
    title: lang === 'bn' ? 'নিরাপদ যাত্রা' : 'Safe Ride',
    shareDescription: lang === 'bn' ? 'আপনার যাত্রার বিবরণ শেয়ার করুন' : 'Share your ride details',
    share: lang === 'bn' ? 'শেয়ার' : 'Share',
  },
  sos: {
    emergency: lang === 'bn' ? 'জরুরী অবস্থা' : 'Emergency',
    callPolice: lang === 'bn' ? 'পুলিশ কল করুন' : 'Call Police',
    cancel: lang === 'bn' ? 'বাতিল' : 'Cancel',
  },
  update: {
    title: lang === 'bn' ? 'নতুন আপডেট' : 'New Update',
    description: lang === 'bn' ? 'অ্যাপের নতুন ভার্সন এসেছে। দয়া করে আপডেট করুন।' : 'A new version is available. Please update.',
    button: lang === 'bn' ? 'আপডেট করুন' : 'Update Now',
    later: lang === 'bn' ? 'পরে' : 'Later',
  },
  shared: {
    retry: lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry',
  }
});

export const strings = getStrings('bn');
