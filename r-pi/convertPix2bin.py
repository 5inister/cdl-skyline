'''Small program that converts image files to .dat files containing one printer-
readable byte per line. To use it type "$ python convertPix2bin.py <image_file>
'''
from PIL import Image
import sys
input_f=sys.argv[-1]
output_f=input_f.split('.')[0]+'.dat'

def convert_pixel_array_to_binary(pixels, w, h):
        """ Convert the pixel array into a black and white plain list of 1's and 0's
            width is enforced to 384 and padded with white if needed. """
        black_and_white_pixels = [1] * 384 * h
        if w > 384:
            print "Bitmap width too large: %s. Needs to be under 384" % w
            return False
        elif w < 384:
            print "Bitmap under 384 (%s), padding the rest with white" % w

        print "Bitmap size", w

        if type(pixels[0]) == int: # single channel
            print " => single channel"
            for i, p in enumerate(pixels):
                if p < 48:
                    black_and_white_pixels[i % w + i / w * 384] = 0
                else:
                    black_and_white_pixels[i % w + i / w * 384] = 1
        elif type(pixels[0]) in (list, tuple) and len(pixels[0]) == 3: # RGB
            print " => RGB channel"
            for i, p in enumerate(pixels):
                if sum(p[0:2]) / 3.0 < 48:
                    black_and_white_pixels[i % w + i / w * 384] = 0
                else:
                    black_and_white_pixels[i % w + i / w * 384] = 1
        elif type(pixels[0]) in (list, tuple) and len(pixels[0]) == 4: # RGBA
            print " => RGBA channel"
            for i, p in enumerate(pixels):
                if sum(p[0:2]) / 3.0 < 48 and p[3] > 127:
                    black_and_white_pixels[i % w + i / w * 384] = 0
                else:
                    black_and_white_pixels[i % w + i / w * 384] = 1
        else:
            print "Unsupported pixels array type. Please send plain list (single channel, RGB or RGBA)"
            print "Type pixels[0]", type(pixels[0]), "haz", pixels[0]
            return False

        return black_and_white_pixels

def convert2bytes(bwpixels,w,h):
	counter=0
	print_bytes=[]        
	for rowStart in xrange(0, h, 256):
            chunkHeight = 255 if (h - rowStart) > 255 else h - rowStart
            print_bytes += (18, 42, chunkHeight, 48)
            
            for i in xrange(0, 48 * chunkHeight, 1):
                # read one byte in
                byt = 0
                for xx in xrange(8):
                    pixel_value = bwpixels[counter]
                    counter += 1
                    # check if this is black
                    if pixel_value == 0:
                        byt += 1 << (7 - xx)
                print_bytes.append(byt)
	return print_bytes


img=Image.open(input_f)
w,h=img.size
pixels=list(img.getdata())
bw_pixels=convert_pixel_array_to_binary(pixels,w,h)
bytes=convert2bytes(bw_pixels,w,h)
with open(output_f,"w") as da_file:
	for b in bytes:
		da_file.write(str(b)+"\n")

