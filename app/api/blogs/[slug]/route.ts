import { NextRequest, NextResponse, userAgent } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/models/blog.model";


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
 
  const slug = params.slug;

  const { device, ua } = userAgent(request);
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const ipAdress = request.headers.get("X-Forwarded-For");

  console.log(device)
  console.log(ua)
  console.log(viewport)
  console.log(ipAdress) 

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedHour = now.getHours().toString().padStart(2, "0");
  const formattedDatetime = `${formattedDate}-${formattedHour}`;

  const visitorId = `${ipAdress}-${ua}-${formattedDatetime}`;

  //not using userId
  // const userResponse = await prisma.user.findUnique({
  //   where: {
  //     id: userId,
  //   },
  //   select: {
  //     id: true,
  //   },
  // });

  // if (!userResponse?.id) {
  //   return NextResponse.json(
  //     { error: true, message: "User not found" },
  //     { status: 404 }
  //   );
  // }

  try {
    await connect() 

    const response = await Blog.findOne({slug: slug, published: true})
     

    if (response?.id) {
      const sentResponse = NextResponse.json(
        { success: true, data: response },
        { status: 200 }
      );

      //TODO blogviews
      // if (sentResponse.status === 200) {
      //   try {
      //     const isViewed = await BlogView.findOne({
      //        blogId: response.id,
      //        visitorId: visitorId
      //     });

      //     if (!isViewed) {
      //       await BlogView.create({
      //         data: {
      //           blog: {
      //             connect: {
      //               id: response.id,
      //             },
      //           },
      //           user: {
      //             connect: {
      //               id: userResponse.id,
      //             },
      //           },
      //           visitorId: visitorId,
      //           viewport: viewport,
      //         },
      //       });
      //     }
      //   } catch (error) {
      //     console.log("view add error", error);
      //   }
      // }

      return sentResponse;
    } else {
      return NextResponse.json(
        { error: true, message: "Blog not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: true, message: "Something went wrong", data: error },
      { status: 500 }
    );
  }
}
