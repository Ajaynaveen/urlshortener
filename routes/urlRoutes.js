const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const authmiddleware = require('../middleware/authmiddleware'); // Use your authentication middleware


const ShortUrl = require('../models/ShortUrl');


router.post('/shorten', authmiddleware.verifytoken, async (req, res) => {
  const { longUrl } = req.body;

  // Check if longUrl is a valid URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if the URL has already been shortened
    let shortUrl = await ShortUrl.findOne({ longUrl });

    if (shortUrl) {
      res.json(shortUrl);
    } else {
    
      const urlCode = shortid.generate();
      const base_url =  'https://urlshortener-db6x.onrender.com'; 
const shortUrl = `${base_url}/${urlCode}`;
console.log(shortUrl)

      

      // Create and save the new short URL
      const newShortUrl = new ShortUrl({
        longUrl,
        shortUrl,
        urlCode,
        user: req.userId, 
      });

      await newShortUrl.save();
     
      res.json(newShortUrl);
    }
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});









router.get('/stats', authmiddleware.verifytoken, async (req, res) => {
  try {
    const userId = req.userId;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const currentDate = new Date().toISOString().split('T')[0]; 

    const todayCount = await ShortUrl.countDocuments({
      user: userId,
      createdAt: {
        $gte: new Date(currentDate + 'T00:00:00.000Z'), 
        $lt: new Date(currentDate + 'T23:59:59.999Z'),
      },
    });
    console.log(todayCount)

    const monthCount = await ShortUrl.countDocuments({
      user: userId,
      createdAt: { $gte: oneMonthAgo },
    });

    const dailyCounts = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const endOfDay = new Date(date.toISOString().split('T')[0] + 'T23:59:59.999Z');

      const count = await ShortUrl.countDocuments({
        user: userId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      dailyCounts.push({ date: date.toISOString().split('T')[0], count });
    }

    res.json({ todayCount, monthCount, dailyCounts });
  } catch (error) {
    console.error('Error fetching URL statistics:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});




router.get('/userinfo', authmiddleware.verifytoken, async (req, res) => {
  try {
   
    const userUrls = await ShortUrl.find({ user: req.userId });
    console.log(userUrls)

   
    res.json(userUrls);
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:urlCode', async (req, res) => {
    const { urlCode } = req.params;
  
    try {
      console.log('Received urlCode:', urlCode);
  
      // Find the short URL by its code
      const shortUrl = await ShortUrl.findOne({ urlCode });
  
      if (shortUrl) {
        console.log('Found matching shortUrl:', shortUrl);
  
        // Increment the click count
        shortUrl.clicks++;
        await shortUrl.save();
  
        
        console.log('Redirecting to:', shortUrl.longUrl);
        return res.redirect(shortUrl.longUrl);
      } else {
        console.log('URL not found');
        return res.status(404).json({ error: 'URL not found' });
      }
    } catch (error) {
      console.error('Error redirecting to original URL:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  });




module.exports = router;
