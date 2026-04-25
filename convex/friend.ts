import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("user not found");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    if (!memberships) {
      throw new ConvexError("This conversation does not have any members");
    }

    if (memberships.length !== 2) {
      throw new ConvexError("This conversation must have exactly 2 members");
    }

    const friendships = await ctx.db.query("friends").withIndex("by_conversationId", (q) => {
        return q.eq("conversationId", args.conversationId)
    }).unique()

    if (!friendships) {
      throw new ConvexError("friendships could not be found");
    }

    const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

    await ctx.db.delete(args.conversationId)

    await ctx.db.delete(friendships._id)

    await Promise.all(messages.map(async message => {
        await ctx.db.delete(message._id)
    }))
  },
});
