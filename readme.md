# DeejayDownload

This is a personal project I developed for downloading the past episodes of my favourite Italian radio show,
 [Deejay Chiama Italia][1], running on [Radio Deejay][2]. I used to download te episodes with a small 
 [PHP app][3] I created when studying at the college (my very first meaningful app!) and then moving the files into
 my phone; but then I realized I could just download the episodes directly on my phone if I learned a bit of React
 Native.

Since it was relatively straightforward, I added to the downloadable list a couple of other shows I like: 
 [Il Volo del Mattino][4] and [No Spoiler][5].

![Main page](https://user-images.githubusercontent.com/12717225/92411545-249ecb00-f0fd-11ea-9d55-c0b3db9c56e2.png) 
![Download window](https://user-images.githubusercontent.com/12717225/92411658-9e36b900-f0fd-11ea-816e-29409550ad08.png)

> **Note:** this app works only on Android

### ToDo:
- [ ] show if an episode is already on the phone to avoid unnecessary download
- [ ] improve progress bar showing %
- [ ] replace download buttons with clear version

#### Development

```npx react-native run-android [--variant=release]```

[1]: https://www.deejay.it/programmi/deejay-chiama-italia
[2]: https://www.deejay.it
[3]: https://github.com/stebogit/getWeb
[4]: https://www.deejay.it/programmi/il-volo-del-mattino
[5]: https://www.deejay.it/programmi/no-spoiler

