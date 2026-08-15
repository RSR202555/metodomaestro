process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadVideo() {
  console.log('Connecting to Supabase Storage:', supabaseUrl);
  
  // 1. Ensure bucket 'videos' exists and is public
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error('Error listing buckets:', bucketErr);
  } else {
    console.log('Existing Buckets:', buckets.map(b => b.name));
  }

  let bucket = buckets?.find(b => b.name === 'videos');
  if (!bucket) {
    console.log('Creating public bucket "videos"...');
    const { data: newBucket, error: createErr } = await supabase.storage.createBucket('videos', {
      public: true,
      fileSizeLimit: 300000000, // 300MB
    });
    if (createErr) {
      console.error('Error creating bucket:', createErr);
    } else {
      console.log('Created bucket:', newBucket);
    }
  }

  // 2. Upload ANUNCIO MAESTRO.mp4
  const filePath = path.join(__dirname, 'public', 'imagens', 'ANUNCIO MAESTRO.mp4');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  console.log('Reading video file (158MB)...');
  const fileBuffer = fs.readFileSync(filePath);
  console.log('File size:', (fileBuffer.length / (1024 * 1024)).toFixed(2), 'MB');

  console.log('Uploading ANUNCIO_MAESTRO.mp4 to Supabase Storage CDN...');
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('videos')
    .upload('ANUNCIO_MAESTRO.mp4', fileBuffer, {
      contentType: 'video/mp4',
      upsert: true
    });

  if (uploadErr) {
    console.error('Upload error:', uploadErr);
    process.exit(1);
  }

  console.log('Upload successful:', uploadData);

  // 3. Get Public URL
  const { data: urlData } = supabase.storage.from('videos').getPublicUrl('ANUNCIO_MAESTRO.mp4');
  console.log('----------------------------------------------------');
  console.log('PUBLIC VIDEO CDN URL:', urlData.publicUrl);
  console.log('----------------------------------------------------');
}

uploadVideo().catch(console.error);
